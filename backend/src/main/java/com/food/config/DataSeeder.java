package com.food.config;

import com.food.model.MenuItem;
import com.food.model.Restaurant;
import com.food.model.User;
import com.food.repository.MenuItemRepository;
import com.food.repository.RestaurantRepository;
import com.food.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public DataSeeder(UserRepository userRepository,  RestaurantRepository restaurantRepository,
                      MenuItemRepository menuItemRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override

   public void run(String... args) {
        if(!userRepository.existsByEmail("admin@food.com")){
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@food.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        if (restaurantRepository.count() > 0) return;

        Restaurant r1 = addRestaurant("Pizza Palace", "Italian, Pizza", "MG Road, Bangalore", 4.4, 30,
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600");
        addItem(r1, "Margherita Pizza", "Classic cheese and tomato", 249, true);
        addItem(r1, "Farmhouse Pizza", "Onion, capsicum, tomato, mushroom", 349, true);
        addItem(r1, "Chicken Pepperoni", "Loaded with chicken pepperoni", 399, false);
        addItem(r1, "Garlic Bread", "Toasted with garlic butter", 129, true);

        Restaurant r2 = addRestaurant("Biryani House", "Biryani, Mughlai", "Koramangala, Bangalore", 4.2, 35,
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600");
        addItem(r2, "Chicken Biryani", "Hyderabadi dum biryani", 299, false);
        addItem(r2, "Veg Biryani", "Fragrant rice with vegetables", 219, true);
        addItem(r2, "Raita", "Cool curd with cucumber", 49, true);
        addItem(r2, "Samosa (2 pcs)", "Crispy samosa with mint chutney", 59, true);

        Restaurant r3 = addRestaurant("Burger Point", "Burgers, Fast Food", "Indiranagar, Bangalore", 4.0, 25,
                "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600");
        addItem(r3, "Aloo Tikki Burger", "Crispy potato patty", 89, true);
        addItem(r3, "Chicken Burger", "Grilled chicken patty", 159, false);
        addItem(r3, "French Fries", "Salted and crispy", 99, true);

        Restaurant r4 = addRestaurant("South Spice", "South Indian", "Jayanagar, Bangalore", 4.5, 20,
                "https://images.unsplash.com/photo-1630383249896-424e482df921?w=600");
        addItem(r4, "Masala Dosa", "Crispy dosa with potato filling", 129, true);
        addItem(r4, "Idli Sambar", "Soft idlis with sambar", 89, true);
        addItem(r4, "Filter Coffee", "Strong South Indian coffee", 49, true);
    }

    private Restaurant addRestaurant(String name, String cuisine, String address, double rating,
                                     int time, String imageUrl) {
        Restaurant r = new Restaurant();
        r.setName(name);
        r.setCuisine(cuisine);
        r.setAddress(address);
        r.setRating(rating);
        r.setDeliveryTime(time);
        r.setImageUrl(imageUrl);
        return restaurantRepository.save(r);
    }

    private void addItem(Restaurant r, String name, String description, double price, boolean veg) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setVeg(veg);
        item.setRestaurant(r);
        menuItemRepository.save(item);
    }
}

