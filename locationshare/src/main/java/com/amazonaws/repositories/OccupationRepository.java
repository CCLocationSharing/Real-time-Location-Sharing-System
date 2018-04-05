package com.amazonaws.repositories;

import java.util.List;
import java.util.Map;
import com.amazonaws.entities.OccupationItem;
import org.springframework.data.repository.CrudRepository;

public interface OccupationRepository extends CrudRepository<OccupationItem, String> {

	OccupationItem findByTabId(String tabId, long currTime);

	boolean isAvailable(String tabId, long currTime);

	Map<String, OccupationItem> findAllByTabId(List<String> tabIds, long currTime);

	void save(OccupationItem occupationItem);

	void saveAll(List<OccupationItem> occupationItems);

	boolean update(OccupationItem occupationItem);

	boolean updateAll(List<OccupationItem> occupationItems);

	void delete(OccupationItem occupationItem);

	void deleteAll(List<OccupationItem> occupationItems);
}