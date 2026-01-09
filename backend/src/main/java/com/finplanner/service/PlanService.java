package main.java.com.finplanner.service;

import com.finplanner.dto.SavePlanRequest;
import com.finplanner.model.Plan;
import com.finplanner.repository.PlanRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanService {

    private final PlanRepository planRepository;

    public PlanService(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    public Plan savePlan(String userId, SavePlanRequest request) {
        Plan plan = new Plan();
        plan.setUserId(userId);
        plan.setType(request.getType());
        plan.setInputs(request.getInputs());
        plan.setResults(request.getResults());
        return planRepository.save(plan);
    }

    public List<Plan> getUserPlans(String userId) {
        return planRepository.findByUserId(userId);
    }

    public void deletePlan(String planId) {
        planRepository.deleteById(planId);
    }
}
