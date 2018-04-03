package com.amazonaws.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.amazonaws.entities.UserItem;

public interface UserRepository extends CrudRepository<UserItem, String> {

	UserItem findById(String userId);

	List<UserItem> findAllById(List<String> userIds); 

}