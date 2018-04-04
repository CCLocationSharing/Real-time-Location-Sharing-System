package com.amazonaws.repositories;

import java.util.List;
import com.amazonaws.entities.ReservationItem;
import org.springframework.data.repository.CrudRepository;

public interface ReservationRepository extends CrudRepository<ReservationItem, String> {

	List<ReservationItem> findByTabId(String tabId, long currTime);

	List<Integer[]> findAvailablePeriods(String tabId, long currTime);

	boolean isReservedByTimeRange(String tabId, long start, long end);

	Map<String, List<ReservationItem>> findAllByTabId(List<String> tabIds);

	save(ReservationItem reservationItem);

	saveAll(List<ReservationItem> reservationItems);

	//cancel();

	//cancelAll();
}