package com.amazonaws.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.amazonaws.entities.OccupationItem;

public interface OccupationRepository extends CrudRepository<OccupationItem, String> {

	OccupationItem findByIdAndIsValid(String id);

	List<OccupationItem> findAllByIdAndAreValid(List<String> ids);

	List<OccupationItem> findByTabIdAndIsValid(String tabId);

	List<OccupationItem> findAllByTabIdAndAreValid(List<String> tabIds);

	List<OccupationItem> findByUserIdAndIsValid(String userId);

	List<OccupationItem> findAllByUserIdAndAreValid(List<String> userIds);

	List<OccupationItem> findAllAndValid();

	OccupationItem save(OccupationItem occupationItem);

	List<OccupationItem> saveAll(List<OccupationItem> occupationItems);
}