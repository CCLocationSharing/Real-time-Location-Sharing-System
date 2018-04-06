package com.amazonaws.repositories;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.amazonaws.constants.TimeConstants;
import com.amazonaws.entities.OccupationItem;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;

public class OccupationRepositoryImpl implements OccupationRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public OccupationRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	public OccupationItem findByTabId(String tabId, long currTime) {
		Map<String, AttributeValue> eav = new HashMap<>();
		eav.put(":v1", new AttributeValue().withS(tabId));
		eav.put(":v2", new AttributeValue().withN(String.valueOf(currTime)));
		eav.put(":v3", new AttributeValue().withBOOL(false));
		DynamoDBQueryExpression<OccupationItem> queryExpression = new DynamoDBQueryExpression<OccupationItem>() 
    		.withKeyConditionExpression("tabId = :v1 and startTime <= :v2")
    		.withFilterExpression("isExpired = :v3")
    		.withExpressionAttributeValues(eav);
    	List<OccupationItem> occupationItems = mapper.query(OccupationItem.class, queryExpression);
    	if(occupationItems != null) {
    		return occupationItems.get(0);
    	}else {
    		return null;
    	}
	}

	public boolean isAvailable(String tabId, long currTime) {
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(currTime);
		int hour = c.get(Calendar.HOUR_OF_DAY);
		if(hour < TimeConstants.OPENTIME || hour > TimeConstants.CLOSETIME) return false;
		Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":v1", new AttributeValue().withS(tabId));
		eav.put(":v2", new AttributeValue().withN(String.valueOf(currTime)));
		eav.put(":v3", new AttributeValue().withBOOL(false));
		DynamoDBQueryExpression<OccupationItem> queryExpression = new DynamoDBQueryExpression<OccupationItem>() 
    		.withKeyConditionExpression("tabId = :v1 and startTime <= :v2")
    		.withFilterExpression("isExpired = :v3")
    		.withExpressionAttributeValues(eav);
    	List<OccupationItem> occupationItems = mapper.query(OccupationItem.class, queryExpression);
    	if(occupationItems != null) {
    		return true;
    	}else {
    		return false;
    	}
	}

	public Map<String, OccupationItem> findAllByTabId(List<String> tabIds, long currTime) {
		Map<String, OccupationItem> result = new HashMap<>();
		for(String tabId: tabIds) {
			OccupationItem occupationItem = findByTabId(tabId, currTime);
			result.put(tabId, occupationItem);
		}
		if(!result.isEmpty()) {
			return result;
		}else {
			System.out.println("ERR: NO MATCHED ROWS");
			return null;
		}
	}

	public void save(OccupationItem occupationItem) {
		mapper.save(occupationItem);
	}

	public void saveAll(List<OccupationItem> occupationItems) {
		mapper.batchSave(occupationItems);
	}

	public boolean update(OccupationItem occupationItem) {
		String tabId = occupationItem.getTabId();
		String userId = occupationItem.getUserId();
		long currTime = occupationItem.getProducedTime();
		OccupationItem item = findByTabId(tabId, currTime);
		if(item == null || !item.getUserId().equals(userId)) {
			System.out.println("ERR: CLOCK OUT FAILURE");
			return false;
		}else {
			item.setIsExpired(true);
			item.setEndTime(currTime);
			mapper.save(item);
			return true;
		}
	}

	public boolean updateAll(List<OccupationItem> occupationItems) {
		List<OccupationItem> items = new ArrayList<>();
		for(OccupationItem occupationItem: occupationItems) {
			String tabId = occupationItem.getTabId();
			String userId = occupationItem.getUserId();
			long currTime = occupationItem.getProducedTime();
			OccupationItem item = findByTabId(tabId, currTime);
			if(item != null && item.getUserId().equals(userId)) {
				item.setIsExpired(true);
				item.setEndTime(currTime);
				items.add(item);
			}
		}
		if(!items.isEmpty()) {
			mapper.batchSave(items);
			return true;
		}else {
			System.out.println("ERR: CLOCK OUT FAILURE");
			return false;
		}
	}

	public void delete(OccupationItem occupationItem) {
		mapper.delete(occupationItem);
	}

	public void deleteAll(List<OccupationItem> occupationItems) {
		mapper.batchDelete(occupationItems);
	}
}