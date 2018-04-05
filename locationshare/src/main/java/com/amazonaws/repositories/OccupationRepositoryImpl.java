package com.amazonaws.repositories;

import java.util.List;
import java.util.Map;
import java.util.Set;
import com.amazonaws.constants.PeriodsConstants;
import com.amazonaws.entities.ReservationItem;
import com.amazonaws.repositories.ReservationRepository;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

public class OccupationRepositoryImple implements OccupationRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public OccupationRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	OccupationItem findByTabId(String tabId, long currTime) {
		Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":v1", new AttributeValue().withS(tabId));
		eav.put(":v2", new AttributeValue().withN(String.valueOf(currTime)));
		eav.put(":v3", new AttributeValue().withBOOL(false));
		DynamoDBQueryExpression<TabItem> queryExpression = new DynamoDBQueryExpression<TabItem>() 
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

	boolean isAvailable(String tabId, long currTime) {
		Date now = new Date(currTime);
		int hour = now.getHours();
		if(hour < 8 || hour > 22) return false;
		Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":v1", new AttributeValue().withS(tabId));
		eav.put(":v2", new AttributeValue().withN(String.valueOf(currTime)));
		eav.put(":v3", new AttributeValue().withBOOL(false));
		DynamoDBQueryExpression<TabItem> queryExpression = new DynamoDBQueryExpression<TabItem>() 
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

	Map<String, OccupationItem> findAllByTabId(List<String> tabIds, long currTime) {
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

	void save(OccupationItem occupationItem) {
		mapper.save(occupationItem);
	}

	void saveAll(List<OccupationItem> occupationItems) {
		mapper.batchSave(occupationItems);
	}

	boolean update(OccupationItem occupationItem) {
		String tabId = occupationItem.getTabId();
		String userId = occupationItem.getUserId();
		long currTime = occupationItem.getProducedTime();
		OccupationItem item = findByTabId(tabId, currTime);
		if(item == null || !item.getUserId().equals(userId)) {
			System.out.println("ERR: CLOCK OUT FAILURE")
			return false;
		}else {
			item.setIsExpired(true);
			item.setEndTime(currTime);
			mapper.save(item);
			return true;
		}
	}

	boolean updateAll(List<OccupationItem> occupationItems) {
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
			System.out.println("ERR: CLOCK OUT FAILURE")
			return false;
		}
	}

	void delete(OccupationItem occupationItem) {
		mapper.delete(occupationItem);
	}

	void deleteAll(List<OccupationItem> occupationItems) {
		mapper.batchDelete(occupationItems);
	}
}