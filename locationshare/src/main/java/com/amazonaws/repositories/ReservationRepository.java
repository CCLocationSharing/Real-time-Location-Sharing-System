package com.amazonaws.repositories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.amazonaws.entities.ReservationItem;

public interface ReservationRepository extends CrudRepository<ReservationItem, String> {

	ReservationItem findById(String id);

	List<ReservationItem> findAllById(List<String> ids);

	List<ReservationItem> findByTabId(String tabId);

	List<ReservationItem> findAllByTabId(List<String> tabIds);

	List<ReservationItem> findByUserId(String userId);

	List<ReservationItem> findAllByUserId(List<String> userIds);

	List<ReservationItem> findByTimeRange(long start, long end);

	List<ReservationItem> findByAfterCurrent(long current);

	List<ReservationItem> findAll();

	ReservationItem save(ReservationItem reservationItem);

	List<ReservationItem> saveAll(List<ReservationItem> reservationItems);
}