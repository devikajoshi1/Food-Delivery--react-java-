package com.food.controller;

import com.food.model.MenuItem;
import com.food.model.Restaurant;
import com.food.repository.MenuItemRepository;
import com.food.repository.RestaurantRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public RestaurantController (RestaurantRepository restaurantRepository, MenuItemRepository menuItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @GetMapping
    public List<Restaurant> getAll(@RequestParam(required = false) String search,
                                   @RequestParam(required = false) String dish) {
        if(dish != null && !dish.isBlank()){
            return restaurantRepository.findByDish(dish);
        }
        if(search == null || search.isBlank()){
            return restaurantRepository.findAll();
        }

        return restaurantRepository.findByNameContainingIgnoreCaseOrCuisineContainingIgnoreCase(search, search);
    }

    @GetMapping("/{id}")
    public Restaurant getOne(@PathVariable Long id){
        return restaurantRepository.findById(id).
                orElseThrow(()-> new RuntimeException("Reataurant not found"));
    }

    @GetMapping("/{id}/menu")
    public List<MenuItem> getMenu(@PathVariable Long id){
        return menuItemRepository.findByRestaurantId(id);
    }
}