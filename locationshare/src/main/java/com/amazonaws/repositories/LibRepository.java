package com.amazonaws.repositories;

import java.util.List;
import com.amazonaws.entities.LibItem;
import org.springframework.data.repository.CrudRepository;

public interface LibRepository extends CrudRepository<LibItem, String> {

	LibItem findByLibId(String libId);

	List<LibItem> findAllByLibId(List<String> libIds); 

}