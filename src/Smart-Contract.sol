{\rtf1\ansi\ansicpg1252\cocoartf1561\cocoasubrtf200
{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww33400\viewh19580\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 pragma solidity ^0.4.16;\
\
contract owned \{\
    function owned() public \{ owner = msg.sender; \}\
    address owner;\
\
    modifier onlyOwner \{\
        require(msg.sender == owner);\
        _;\
    \}\
\}\
\
contract ownedd is owned \{\
    // This contract inherits the `onlyOwner` modifier from\
    // `owned` and applies it to the `close` function, which\
    // causes that calls to `close` only have an effect if\
    // they are made by the stored owner.\
    function close() public onlyOwner \{\
        selfdestruct(owner);\
    \}\
\}\
\
contract Database \{\
    bytes x;\
    function write(bytes _x) public \{\
      x = _x;\
    \}\
    \
    function read() public view returns (bytes) \{\
      return x;\
    \}\
\}\
\
contract Verify\
\{\
    // Credential data variables\
    address public owner;\
    bytes32 public issuer;\
    bytes32 public recipient;\
    uint256 public credentialDate;\
    bytes32 public credentialStatus;\
    bytes public imageHash;\
    bytes public credentialProofDoc;\
 uint public blockNumber;\
    bytes32 public blockHashNow;\
    bytes32 public blockHashPrevious;\
    \
    //Set Owner\
    function Credential() \{\
        owner = msg.sender;\
    \}\
    modifier onlyowner() \{ \
        if (msg.sender == owner)\
            _;\
    \}\
  	\
 \
    // Create initial credential contract\
    function createCredential(bytes32 issuerEntry, bytes32 recipientEntry, uint256 credentialDateEntry, bytes32 credentialEntry, bytes32 descriptionEntry) onlyowner\
    \{\
        issuer = issuerEntry;\
        recipient = recipientEntry;\
        credentialDate = credentialDateEntry;\
    \}\
    \
    function getOwner() returns (address owner)\
    \{\
        return owner;\
    \}\
    \
    // Set the status if it changes\
    function setStatus(bytes32 status) onlyowner\
    \{\
        credentialStatus = status;\
        log(block.timestamp, "Status Changed", status);\
    \}\
    //hash of file\
    function setImage(bytes IPFSHash) \
    \{\
        imageHash = IPFSHash;\
        log(block.timestamp, "Entered Image", "Data is in IPFS");\
    \}\
    //doc upload\
    function credentialProof(bytes HashProof) \
    \{\
        credentialProofDoc = HashProof;\
    \}\
\
    // Logs events\
    function log(uint256 eventTimeStamp, bytes32 name, bytes32 description)\
    \{\
        MajorEvent(block.timestamp, eventTimeStamp, name, description);\
    \}\
\
    // Declare event structure\
    event MajorEvent(uint256 logTimeStamp, uint256 eventTimeStamp, bytes32 indexed name, bytes32 indexed description);\
  \
\
	//reverts invalid data\
    function () \{\
        revert;\
    \}\
\
\}}