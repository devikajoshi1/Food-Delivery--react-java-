package com.food.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;


public record OrderRequest(@NotNull Long restaurantId,
                           @NotBlank(message = "Address is required") String address,
                           @NotEmpty(message = "Cart is empty") List<Item> items ,
                            @NotBlank(message = "Please choose a payment method")String paymentMethod) {

    public record Item(Long menuItemId, int quantity) {}
}
