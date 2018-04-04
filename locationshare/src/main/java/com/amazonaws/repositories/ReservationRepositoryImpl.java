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

public class ReservationRepositoryImpl implements ReservationRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public ReservationRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	List<ReservationItem> findByTabId(String tabId, long currTime) {
		Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":v1", new AttributeValue().withS(tabId));
		eav.put(":v2", new AttributeValue().withN(currTime));
		DynamoDBQueryExpression<TabItem> queryExpression = new DynamoDBQueryExpression<TabItem>() 
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

	List<Integer> findAvailablePeriods(String tabId, long currTime) {
		List<ReservationItem> result = findByTabId(tabId, currTime);
		Set<Integer> available = new HashSet(PeriodsConstants.p);
		for(ReservationItem item: result) {
			Date dates = new Date(item.getStartTime());
			int hours = dates.getHours();
			Date datee = new Date(item.getEndTime());
			int houre = datee.getHours();
			for(int i = hours; i <= houre; ++i) {
				available.remove(i);
			}	
		}
		Date datem = new Date(currTime);
		int hourm = datem.getHours();
		List<Integer> availablePeriods = new ArrayList<>();
		for(Integer j: available) {
			if(j > hourm)
				availablePeriods.add(j);
		}
		return availablePeriods;
	}

	boolean isAvailableByTimeRange(String tabId, long start, long end) {
		Date ds = new Date(start);
		Date de = new Date(end);
		int low = ds.getHours();
		int high = de.getHours();
		if(low < 8 || high > 22) return false;
		List<ReservationItem> result = findByTabId(tabId, currTime);
		for(ReservationItem item: result) {
			Date dates = new Date(item.getStartTime());
			int hours = dates.getHours();
			Date datee = new Date(item.getEndTime());
			int houre = datee.getHours();
			if(high < hours || low > houre) {
				continue;
			}else {
				return false;
			}
		}
		return true;
	}

	Map<String, List<ReservationItem>> findAllByTabId(List<String> tabIds) {
		Map<String, List<ReservationItem>> result = new HashMap<>();
		long currTime = System.currentTimeMillis();
		for(String tabId: tabIds) {
			List<ReservationItem> reservationItems = findByTabId(tabId, currTime);
			result.put(tabId, reservationItems);
		}
		return result;
	}

	void save(ReservationItem reservationItem) {
		mapper.save(reservationItem);
	}

	void saveAll(List<ReservationItem> reservationItems) {
		mapper.batchSave(reservationItems);
	}

	void delete(ReservationItem reservationItem) {
		mapper.delete(reservationItem);
	}

	void deleteAll(List<ReservationItem> reservationItems) {
		mapper.batchDelete(reservationItems);
	}

}