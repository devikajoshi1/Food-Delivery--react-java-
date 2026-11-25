package com.food.repository;

import com.food.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantId(long restaurantId);

    //admin use to delete dish
    void deleteByRestaurantId(Long restaurantId);
}