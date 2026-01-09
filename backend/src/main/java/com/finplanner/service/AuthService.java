@Autowired
private UserRepository userRepo;

@Autowired
private PasswordEncoder passwordEncoder;

public void register(String email, String password) {
    if (userRepo.findByEmail(email).isPresent()) {
        throw new RuntimeException("Email already exists");
    }
    User user = new User();
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(password));
    userRepo.save(user);
}
