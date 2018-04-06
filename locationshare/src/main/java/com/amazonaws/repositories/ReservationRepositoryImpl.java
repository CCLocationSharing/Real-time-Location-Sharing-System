package com.amazonaws.repositories;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;

import com.amazonaws.constants.TimeConstants;
import com.amazonaws.entities.ReservationItem;
import com.amazonaws.repositories.ReservationRepository;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;

public class ReservationRepositoryImpl implements ReservationRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public ReservationRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	public List<ReservationItem> findByTabId(String tabId, long currTime) {
		Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":v1", new AttributeValue().withS(tabId));
		eav.put(":v2", new AttributeValue().withN(String.valueOf(currTime)));
		DynamoDBQueryExpression<ReservationItem> queryExpression = new DynamoDBQueryExpression<ReservationItem>() 
    		.withKeyConditionExpression("tabId = :v1")
    		.withFilterExpression("endTime > :v2")
    		.withExpressionAttributeValues(eav);
    	List<ReservationItem> reservationItems = mapper.query(ReservationItem.class, queryExpression);
    	if(reservationItems != null) {
    		return reservationItems;
    	}else {
    		System.out.println("ERR: NO MATCHED ROWS");
			return null;
    	}
	}

	public List<Integer> findAvailablePeriods(String tabId, long currTime) {
		List<ReservationItem> reservationItems = findByTabId(tabId, currTime);
		Set<Integer> available = new HashSet<>(TimeConstants.PERIODS);
		for(ReservationItem item: reservationItems) {
			int hour_s = getHours(item.getStartTime());
			int hour_e = getHours(item.getEndTime());
			for(int i = hour_s; i <= hour_e; ++i) {
				available.remove(i);
			}	
		}
		int hour_now = getHours(currTime);
		List<Integer> availablePeriods = new ArrayList<>();
		for(Integer j: available) {
			if(j > hour_now)
				availablePeriods.add(j);
		}
		if(!availablePeriods.isEmpty()) {
			return availablePeriods;
		}else {
			return null;
		}
	}

	public boolean isAvailableByTimeRange(String tabId, long currTime, long start, long end) {
		int hour_start = getHours(start);
		int hour_end = getHours(end);
		
		if(hour_start < TimeConstants.OPENTIME || hour_end > TimeConstants.CLOSETIME) {
			return false;
		}
		List<ReservationItem> reservationItems = findByTabId(tabId, currTime);
		for(ReservationItem item: reservationItems) {
			int hour_s = getHours(item.getStartTime());
			int hour_e = getHours(item.getEndTime());
			if(hour_end < hour_s || hour_start > hour_e) {
				continue;
			}else {
				return false;
			}
		}
		return true;
	}

	public Map<String, List<ReservationItem>> findAllByTabId(List<String> tabIds, long currTime) {
		Map<String, List<ReservationItem>> result = new HashMap<>();
		for(String tabId: tabIds) {
			List<ReservationItem> reservationItems = findByTabId(tabId, currTime);
			result.put(tabId, reservationItems);
		}
		if(!result.isEmpty()) {
			return result;
		}else {
			System.out.println("ERR: NO MATCHED ROWS");
			return null;
		}
	}

	public void save(ReservationItem reservationItem) {
		mapper.save(reservationItem);
	}

	public void saveAll(List<ReservationItem> reservationItems) {
		mapper.batchSave(reservationItems);
	}

	public void delete(ReservationItem reservationItem) {
		mapper.delete(reservationItem);
	}

	public void deleteAll(List<ReservationItem> reservationItems) {
		mapper.batchDelete(reservationItems);
	}
	
	private int getHours(long time) {
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(time);
		return c.get(Calendar.HOUR_OF_DAY);
	}

}