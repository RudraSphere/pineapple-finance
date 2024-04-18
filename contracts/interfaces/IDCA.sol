interface IDCA {
    event DCASetup(
        address indexed user,
        address token,
        uint256 amount,
        uint256 interval
    );
    event DCAExecuted(address indexed user, address token, uint256 amount);

    function setupDCA(
        address _tokenAddress,
        uint256 _amount,
        uint256 _interval
    ) external;

    function executeDCA(uint index) external;
}
