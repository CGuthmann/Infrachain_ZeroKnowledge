// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CollateralToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    constructor() ERC20("CollateralToken", "CLT") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(BURNER_ROLE, msg.sender);
    }

    //MINTING
    bytes32 public constant MINTER_ROLE = keccak256("MINTER");

    function addMinter(address _minterAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setupRole(MINTER_ROLE, _minterAddress);
    }

    function renounceMinter(address _minterAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            hasRole(MINTER_ROLE, _minterAddress),
            "The address does not not belong to the MINTER_ROLE"
        );
        renounceRole(MINTER_ROLE, _minterAddress);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    //BURNING
    bytes32 public constant BURNER_ROLE = keccak256("BURNER");

    function addBurner(address _burnerAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setupRole(BURNER_ROLE, _burnerAddress);
    }

    function renounceBurner(address _burnerAddress)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(
            hasRole(BURNER_ROLE, _burnerAddress),
            "The address does not belong to the BURNER_ROLE"
        );
        renounceRole(BURNER_ROLE, _burnerAddress);
    }

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}
