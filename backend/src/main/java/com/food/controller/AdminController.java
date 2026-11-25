package com.food.controller;

import com.food.model.MenuItem;
import com.food.model.Order;
import com.food.model.Restaurant;
import com.food.repository.MenuItemRepository;
import com.food.repository.RestaurantRepository;
import com.food.service.OrderService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderService orderService;


    public AdminController(RestaurantRepository restaurantRepository,
                           MenuItemRepository menuItemRepository, OrderService orderService) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderService = orderService;
    }

    @PostMapping("/restaurants")
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        restaurant.setId(null);
        return restaurantRepository.save(restaurant);
    }

    @Transactional
    @DeleteMapping("/restaurants/{id}")
    public void deleteRestaurant(@PathVariable Long id){
        menuItemRepository.deleteByRestaurantId(id);
        restaurantRepository.deleteById(id);
    }

    @PostMapping("/restaurants/{id}/menu")
    public MenuItem addMenuItem(@PathVariable Long id, @RequestBody MenuItem item) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        item.setId(null);
        item.setRestaurant(restaurant);
        return menuItemRepository.save(item);
    }

    @DeleteMapping("/menu/{id}")
    public void deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
    }

    @GetMapping("/orders")
    public List<Order> allOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/orders/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderService.updateStatus(id, status);
    }
}