package com.amazonaws.repositories;

import java.util.List;
import java.util.Map;
import com.amazonaws.entities.ReservationItem;
import org.springframework.data.repository.CrudRepository;

public interface ReservationRepository extends CrudRepository<ReservationItem, String> {

	List<ReservationItem> findByTabId(String tabId, long currTime);

	List<Integer> findAvailablePeriods(String tabId, long currTime);

	boolean isAvailableByTimeRange(String tabId, long currTime, long start, long end);

	Map<String, List<ReservationItem>> findAllByTabId(List<String> tabIds, long currTime);

	void save(ReservationItem reservationItem);

	void saveAll(List<ReservationItem> reservationItems);

	void delete(ReservationItem reservationItem);

	void deleteAll(List<ReservationItem> reservationItems);
}