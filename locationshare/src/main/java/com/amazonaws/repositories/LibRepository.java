package com.amazonaws.repositories;

import java.util.List;
import com.amazonaws.entities.LibItem;

public interface LibRepository {

	LibItem findByLibId(String libId);

	List<Object> findAllByLibId(List<String> libIds); 

}