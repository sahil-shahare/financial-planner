package main.java.com.finplanner.repository;

import com.finplanner.model.Plan;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PlanRepository extends MongoRepository<Plan, String> {

    List<Plan> findByUserId(String userId);
}
