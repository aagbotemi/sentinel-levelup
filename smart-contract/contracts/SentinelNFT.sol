// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SentinelNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    constructor(
        string memory baseTokenURI
    ) ERC721("Sentinel", "SNTL") Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }

    // WRITE FUNCTION
    function mintTo(address receiver) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(receiver, tokenId);
        _setTokenURI(tokenId, _baseTokenURI);
        return tokenId;
    }

    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    // READ FUNCTION
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
