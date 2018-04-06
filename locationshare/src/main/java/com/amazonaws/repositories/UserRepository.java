package com.amazonaws.repositories;

import java.util.List;
import com.amazonaws.entities.UserItem;

public interface UserRepository {

	UserItem findById(String userId);

	List<Object> findAllById(List<String> userIds); 

}