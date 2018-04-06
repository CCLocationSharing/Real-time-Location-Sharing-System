package com.amazonaws.repositories;

import java.util.List;
import java.util.Map;
import com.amazonaws.entities.TabItem;

public interface TabRepository {

	TabItem findByLibIdAndTabId(String libId, String tabId);

	List<Object> findAllByLibIdAndTabId(List<String[]> combos);

	List<TabItem> findByLibId(String libId);

	Map<String, List<TabItem>> findAllByLibId(List<String> libIds);

}