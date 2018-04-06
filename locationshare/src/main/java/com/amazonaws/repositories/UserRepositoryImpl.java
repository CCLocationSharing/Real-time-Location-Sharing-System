package com.amazonaws.repositories;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.amazonaws.entities.UserItem;
import com.amazonaws.repositories.UserRepository;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;

public class UserRepositoryImpl implements UserRepository {

	@Autowired
	private AmazonDynamoDB amazonDynamoDB;
	private DynamoDBMapper mapper;

	public UserRepositoryImpl() {
		this.mapper = new DynamoDBMapper(amazonDynamoDB);
	}

	public UserItem findById(String userId) {
		UserItem userItem = mapper.load(UserItem.class, userId);
		if(userItem != null) {
			return userItem;
		}else {
			System.out.println("ERR: NO MATCHED ROW");
			return null;
		}
	}

	public List<Object> findAllById(List<String> userIds) {
		List<UserItem> userItems= new ArrayList<>();
		for(String userId: userIds) {
			UserItem userItem = new UserItem();
			userItem.setUserId(userId);
			userItems.add(userItem);
		}
		Map<String, List<Object>> items = mapper.batchLoad(userItems);
		if(items != null) {
			return items.get("USR");
		}else {
			System.out.println("ERR: NO MATCHED ROWS");
			return null;
		}
	}
}