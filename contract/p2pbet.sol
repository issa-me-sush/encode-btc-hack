// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract P2PBetting {
    struct BetInfo {
        address creator;
        address opponent;
        address moderator;
        uint256 amount;
        string description;
        uint256 deadline;
        BetStatus status;
    }

    struct BetParticipants {
        string creatorTwitter;
        string opponentTwitter;
        string moderatorTwitter;
        address winner;
        address expectedOpponent;
        address expectedModerator;
    }

    struct Bet {
        address creator;
        address opponent;
        address moderator;
        uint256 amount;
        string description;
        uint256 deadline;
        BetStatus status;
        string creatorTwitter;
        string opponentTwitter;
        string moderatorTwitter;
        address winner;
        address expectedOpponent;
        address expectedModerator;
    }

    enum BetStatus {
        Created,
        AcceptedByOpponent,
        AcceptedByModerator,
        Active,
        Completed,
        Cancelled
    }

    mapping(uint256 => Bet) public bets;
    uint256 public betCount;

    event BetCreated(
        uint256 indexed betId,
        address indexed creator,
        address expectedOpponent,
        address expectedModerator,
        string opponentTwitter,
        string moderatorTwitter,
        uint256 amount
    );
    event BetAccepted(uint256 indexed betId, address indexed opponent);
    event ModeratorConfirmed(uint256 indexed betId, address indexed moderator);
    event BetResolved(uint256 indexed betId, address indexed winner);
    event BetCancelled(uint256 indexed betId);

    modifier onlyBetParticipant(uint256 betId) {
        require(
            msg.sender == bets[betId].creator ||
            msg.sender == bets[betId].opponent ||
            msg.sender == bets[betId].moderator,
            "Not authorized"
        );
        _;
    }

    function createBet(
        address _expectedOpponent,
        address _expectedModerator,
        string memory _opponentTwitter,
        string memory _moderatorTwitter,
        string memory _description,
        uint256 _deadline,
        string memory _creatorTwitter
    ) external payable returns (uint256) {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_expectedOpponent != address(0), "Invalid opponent address");
        require(_expectedModerator != address(0), "Invalid moderator address");
        require(_expectedOpponent != _expectedModerator, "Opponent and moderator must be different");
        require(_expectedOpponent != msg.sender, "Cannot bet against yourself");
        require(_expectedModerator != msg.sender, "Cannot moderate your own bet");

        uint256 betId = betCount++;
        Bet storage newBet = bets[betId];
        
        newBet.creator = msg.sender;
        newBet.amount = msg.value;
        newBet.description = _description;
        newBet.deadline = _deadline;
        newBet.status = BetStatus.Created;
        newBet.creatorTwitter = _creatorTwitter;
        newBet.opponentTwitter = _opponentTwitter;
        newBet.moderatorTwitter = _moderatorTwitter;
        newBet.expectedOpponent = _expectedOpponent;
        newBet.expectedModerator = _expectedModerator;

        emit BetCreated(
            betId,
            msg.sender,
            _expectedOpponent,
            _expectedModerator,
            _opponentTwitter,
            _moderatorTwitter,
            msg.value
        );

        return betId;
    }

    function acceptBet(uint256 betId) external payable {
        Bet storage bet = bets[betId];
        require(bet.status == BetStatus.Created, "Bet cannot be accepted");
        require(msg.value == bet.amount, "Must match bet amount");
        require(block.timestamp < bet.deadline, "Bet deadline passed");
        require(msg.sender == bet.expectedOpponent, "Not the expected opponent");
        require(msg.sender != bet.creator, "Creator cannot accept their own bet");

        bet.opponent = msg.sender;
        bet.status = BetStatus.AcceptedByOpponent;

        emit BetAccepted(betId, msg.sender);
    }

    function confirmModerator(uint256 betId) external {
        Bet storage bet = bets[betId];
        require(bet.status == BetStatus.AcceptedByOpponent, "Bet not ready for moderator");
        require(block.timestamp < bet.deadline, "Bet deadline passed");
        require(msg.sender == bet.expectedModerator, "Not the expected moderator");
        require(msg.sender != bet.creator && msg.sender != bet.opponent, "Participants cannot be moderator");

        bet.moderator = msg.sender;
        bet.status = BetStatus.Active;

        emit ModeratorConfirmed(betId, msg.sender);
    }

    function resolveBet(uint256 betId, address winner) external {
        Bet storage bet = bets[betId];
        require(msg.sender == bet.moderator, "Only moderator can resolve");
        require(bet.status == BetStatus.Active, "Bet not active");
        require(
            winner == bet.creator || winner == bet.opponent,
            "Invalid winner address"
        );

        bet.winner = winner;
        bet.status = BetStatus.Completed;

        uint256 winnings = bet.amount * 2;
        (bool sent, ) = winner.call{value: winnings}("");
        require(sent, "Failed to send winnings");

        emit BetResolved(betId, winner);
    }

    function cancelBet(uint256 betId) external onlyBetParticipant(betId) {
        Bet storage bet = bets[betId];
        require(bet.status != BetStatus.Completed, "Bet already completed");
        
        if (bet.status == BetStatus.Created) {
            require(msg.sender == bet.creator, "Only creator can cancel");
            (bool sent, ) = bet.creator.call{value: bet.amount}("");
            require(sent, "Failed to return funds");
        } else {
            require(
                msg.sender == bet.moderator || block.timestamp > bet.deadline,
                "Not authorized to cancel"
            );
            // Return funds to both parties
            (bool sent1, ) = bet.creator.call{value: bet.amount}("");
            (bool sent2, ) = bet.opponent.call{value: bet.amount}("");
            require(sent1 && sent2, "Failed to return funds");
        }

        bet.status = BetStatus.Cancelled;
        emit BetCancelled(betId);
    }

    function getBetInfo(uint256 betId) external view returns (BetInfo memory) {
        Bet storage bet = bets[betId];
        return BetInfo(
            bet.creator,
            bet.opponent,
            bet.moderator,
            bet.amount,
            bet.description,
            bet.deadline,
            bet.status
        );
    }

    function getBetParticipants(uint256 betId) external view returns (BetParticipants memory) {
        Bet storage bet = bets[betId];
        return BetParticipants(
            bet.creatorTwitter,
            bet.opponentTwitter,
            bet.moderatorTwitter,
            bet.winner,
            bet.expectedOpponent,
            bet.expectedModerator
        );
    }
}