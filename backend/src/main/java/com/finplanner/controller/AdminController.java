package com.finplanner.controller;

import com.finplanner.model.Plan;
import com.finplanner.model.User;
import com.finplanner.repository.PlanRepository;
import com.finplanner.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepo;
    private final PlanRepository planRepo;

    public AdminController(UserRepository userRepo, PlanRepository planRepo) {
        this.userRepo = userRepo;
        this.planRepo = planRepo;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/plans")
    public List<Plan> getAllPlans() {
        return planRepo.findAll();
    }

    @DeleteMapping("/plans/{id}")
    public void deleteAnyPlan(@PathVariable String id) {
        planRepo.deleteById(id);
    }
}
