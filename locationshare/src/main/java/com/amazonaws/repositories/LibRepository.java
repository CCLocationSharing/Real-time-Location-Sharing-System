package com.amazonaws.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.amazonaws.entities.LibItem;

public interface LibRepository extends CrudRepository<LibItem, Integer> {

	LibItem findById(Integer libId);

	LibItem findByName(String libName);

	List<LibItem> findAllById(List<Integer> ids); 

	List<LibItem> findAllByName(List<String> names);

	List<LibItem> findAll(); 

}