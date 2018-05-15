pragma solidity ^0.4.16;

contract VerifiedDocument
{
    address public owner;
    bytes32 public issuer;
    bytes32 public recipient;
    uint256 public credentialDate;
    bytes32 public credentialStatus;
    bytes public docHash;
    bytes public docHashProof;
    mapping (bytes32 => bytes) sharedHashes;
    mapping (bytes32 => bytes) sharedHashProofs;

    function Credential() {
        owner = msg.sender;
    }

    modifier onlyowner() { 
        if (msg.sender == owner)
            _;
    }
  	
 
    function createCredential(bytes32 issuerEntry, bytes32 recipientEntry, uint256 credentialDateEntry, bytes32 credentialEntry, bytes32 descriptionEntry) onlyowner
    {
        issuer = issuerEntry;
        recipient = recipientEntry;
        credentialDate = credentialDateEntry;
    }
    
    function getOwner() returns (address owner)
    {
        return owner;
    }
    

    function setStatus(bytes32 status) onlyowner
    {
        credentialStatus = status;
    }

    function setImage(bytes IPFSHash) 
    {
        docHash = IPFSHash;
    }

    function credentialProof(bytes HashProof) 
    {
        docHashProof = HashProof;
    }

    function share(bytes32 shareTo, bytes ipfsSharedHash, bytes sharedHashProof)
    {
        sharedHashes[sharedTo] = ipfsSharedHash;
        sharedHashProofs[sharedTo] = sharedHashProof
    }

    function getHash() returns (bytes docHash)
    {
        return docHash;
    }

    function getHashProof() returns (bytes docHashProof)
    {
        return docHashProof;
    }

    function getHashShared(bytes32 address) returns (bytes docHashShared)
    {
        bytes docHashShared = sharedHashes[address];
        return docHashShared;
    }

    function getHashProofShared(bytes32 address) returns (bytes docHashProofShared)
    {
        bytes docHashProofShared = sharedHashProofs[address];
        return docHashProofShared;
    }
}