package com.amazonaws.repositories;

import java.util.List;
import com.amazonaws.entities.UserItem;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<UserItem, String> {

	UserItem findById(String userId);

	List<UserItem> findAllById(List<String> userIds); 

}