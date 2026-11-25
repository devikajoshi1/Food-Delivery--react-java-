package com.food.repository;

import com.food.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCase(String name, String cuisine);

    // Restaurants that have at least one menu item whose name contains the dish, e.g. "samosa"
    @Query("SELECT DISTINCT m.restaurant FROM MenuItem m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :dish, '%'))")
    List<Restaurant> findByDish(@Param("dish") String dish);

}
