package com.amazonaws.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.amazonaws.entities.TabItem;

public interface TabRepository extends CrudRepository<TabItem, String> {

	TabItem findById(String tabId);

	List<TabItem> findAllById(List<String> tabIds);

	List<TabItem> findByLibId(String libId);

}