package com.amazonaws.repositories;

import java.util.List;
import java.util.Map;
import com.amazonaws.entities.TabItem;
import org.springframework.data.repository.CrudRepository;

public interface TabRepository extends CrudRepository<TabItem, String> {

	TabItem findByLibIdAndTabId(String libId, String tabId);

	List<TabItem> findAllByLibIdAndTabId(List<String[]> combos);

	List<TabItem> findByLibId(String libId);

	Map<String, List<TabItem>> findAllByLibId(List<String> libIds);

}