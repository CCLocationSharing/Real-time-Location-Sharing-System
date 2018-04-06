package com.amazonaws.repositories;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.amazonaws.entities.TabItem;
import com.amazonaws.repositories.TabRepository;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;

public class TabRepositoryImpl implements TabRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public TabRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	public TabItem findByLibIdAndTabId(String libId, String tabId) {
		TabItem tabItem = mapper.load(TabItem.class, libId, tabId);
		if(tabItem != null) {
			return tabItem;
		}else {
			System.out.println("ERR: NO MATCHED ROW");
			return null;
		}
	}

	public List<Object> findAllByLibIdAndTabId(List<String[]> combos) {
		List<TabItem> tabItems = new ArrayList<>();
		for(String[] ids: combos) {
			TabItem tabItem = new TabItem();
			tabItem.setLibId(ids[0]);
			tabItem.setTabId(ids[1]);
			tabItems.add(tabItem);
		}
		Map<String, List<Object>> items = mapper.batchLoad(tabItems);
		if(items != null) {
			return items.get("TAB");
		}else {
			System.out.println("ERR: NO MATCHED ROWS");
			return null;
		}
	}

	public List<TabItem> findByLibId(String libId) {
		Map<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
		eav.put(":v1", new AttributeValue().withS(libId));
		DynamoDBQueryExpression<TabItem> queryExpression = new DynamoDBQueryExpression<TabItem>() 
    		.withKeyConditionExpression("libId = :v1")
    		.withExpressionAttributeValues(eav);
    	List<TabItem> tabItems = mapper.query(TabItem.class, queryExpression);
    	if(tabItems != null) {
    		return tabItems;
    	}else {
    		System.out.println("ERR: NO MATCHED ROWS");
			return null;
    	}
	}

	public Map<String, List<TabItem>> findAllByLibId(List<String> libIds) {
		Map<String, List<TabItem>> result = new HashMap<>();
		for(String libId: libIds) {
			List<TabItem> tabItems = findByLibId(libId);
			result.put(libId, tabItems);
		}
		return result;
	}
}