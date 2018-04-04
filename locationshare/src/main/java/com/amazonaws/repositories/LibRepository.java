package com.amazonaws.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.amazonaws.entities.LibItem;

public interface LibRepository extends CrudRepository<LibItem, String> {

	LibItem findByLibId(String libId);

	LibItem findByLibName(String libName);

	List<LibItem> findAllByLibId(List<String> libIds); 

	List<LibItem> findAllByLibName(List<String> libNames);

	List<LibItem> findAll(); 

}