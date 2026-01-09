package main.java.com.finplanner.controller;

import com.finplanner.dto.SavePlanRequest;
import com.finplanner.model.Plan;
import com.finplanner.service.PlanService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
public class PlanController {

    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @PostMapping
    public Plan savePlan(@RequestBody SavePlanRequest request,
                         Authentication authentication) {

        String userId = authentication.getName(); // userId from JWT
        return planService.savePlan(userId, request);
    }

    @GetMapping
    public List<Plan> getPlans(Authentication authentication) {
        return planService.getUserPlans(authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable String id) {
        planService.deletePlan(id);
    }
}
