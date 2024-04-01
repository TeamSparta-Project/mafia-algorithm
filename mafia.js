//FIXME - 라운드, 밤, 낮 시작 및 종료 다시 확인할 것
//FIXME - 리팩토링 반드시 할 것
//FIXME - 객체 this 이용할 것
//FIXME - 플레이어가 중간에 나갈 경우 (죽은 것으로 처리), 플레이어가 중간에 죽을 경우 (roles 재 설정) 생각
//FIXME - 마피아끼리 회의하기 전에 카메라 마이크 켜지는거 빠짐
//FIXME - 화면 켜짐이 카메라 이야기인지 플레이어 게임 화면이야기 인지 구체적으로 적기
//FIXME - 사회자(시스템)가 누구에게 말하는지 정확하게 하기
//FIXME - 플레이어가 자신의 역할을 하기전에 자신이 살아있는지 확인, 만약 역할을 해야하는 데 죽었을 경우 무엇을 해야할지 조치

//NOTE - 타이머로 시간 잼
const startTimer = (seconds) => {
  console.log("타이머 시작");
  if (seconds >= 60) {
    console.log(`${Math.floor(seconds / 60)}분 ${seconds % 60}초 재는 중`);
  } else {
    console.log(`${seconds % 60}초 재는 중`);
  }
  console.log("타이머 종료");
};

//NOTE - 게임 레디
const setReady = (players, index) => {
  players[index].isReady = true;
};

//NOTE - 인원 수 맞는지 확인
const checkParticipantsCountEnough = (count, participants) => {
  return participants.length === count;
};

//NOTE - 모든 플레이어들이 전부 레디했는지 확인
const checkAllParticipantsReady = (participants) => {
  let result = true;
  participants.forEach((participant) => {
    if (participant.isReady === false) {
      result = false;
    }
  });

  return result;
};

//NOTE - 게임이 시작가능한 지 확인
const canGameStart = (isEnoughCount, isAllReady) => {
  return isEnoughCount && isAllReady;
};

//NOTE - 참가자들 랜덤으로 섞기(피셔-예이츠 셔플 알고리즘)
const shuffleParticipants = (participants) => {
  for (let i = participants.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); //NOTE - math.random() 대체제 생각해보기
    [participants[i], participants[j]] = [participants[j], participants[i]];
  }
};

//NOTE - 참감자들 중 한명 랜덤으로 뽑기
const getRandomParticipant = (participants) => {
  shuffleParticipants(participants); //NOTE - 앞에 moderator 붙여야 하나?
  return participants.pop();
};

//NOTE - 참가자를 마피아 플레이어로 설정
const setPlayerMafia = (players, participant) => {
  players[participant.index] = {
    ...mafia,
    index: participant.index,
    userNickname: participant.userNickname,
  };
};

//NOTE - 참가자를 경찰 플레이어로 설정
const setPlayerPolice = (players, participant) => {
  players[participant.index] = {
    ...police,
    index: participant.index,
    userNickname: participant.userNickname,
  };
};

//NOTE - 참가자를 의사 플레이어로 설정
const setPlayerDoctor = (players, participant) => {
  players[participant.index] = {
    ...doctor,
    index: participant.index,
    userNickname: participant.userNickname,
  };
};

//NOTE - 참가자를 시민 플레이어로 설정
const setPlayerCitizen = (players, participant) => {
  players[participant.index] = {
    ...citizen,
    index: participant.index,
    userNickname: participant.userNickname,
  };
};

//NOTE - 게임을 진행하면서 각 역할을 누가 맡았는지 객체에 저장
const setRoles = (players, roles) => {
  Object.keys(roles).forEach((key) => delete roles[key]);
  players.forEach((player, index) => {
    if (roles[player.role] === undefined) {
      roles[player.role] = [];
    }

    if (player.isLived) {
      roles[player.role].push(index);
    }
  });
};

//NOTE - 게임 시작
const gameStart = () => {
  console.log("게임 시작");
};

//NOTE - 게임 끝
const gameOver = () => {
  console.log("게임 종료");
};

//NOTE - 라운드 시작
const roundStart = () => {
  console.log("라운드 시작");
};

//NOTE - 라운드 종료
const roundOver = () => {
  console.log("라운드 종료");
};

//NOTE - 밤 시작
const nightStart = () => {
  console.log("밤 시작");
};

//NOTE - 밤 종료
const nightOver = () => {
  console.log("밤 종료");
};

//NOTE - 낮 시작
const dayStart = () => {
  console.log("낮 시작");
};

//NOTE - 낮 종료
const dayOver = () => {
  console.log("낮 종료");
};

//NOTE - 유저 닉네임 설정
const setUserNickname = (players, index, nickname) => {
  players[index].nickname = nickname;
};
//NOTE - 플레이어를 선택하는 투표
const voteToPlayer = (players, senderIndex, receiverIndex) => {
  players[senderIndex].voteTo = receiverIndex;
  players[receiverIndex].votedCount++;
};

//NOTE - 찬성, 반대를 결정하는 투표
const voteYesOrNo = (votes, yesOrNo) => {
  votes.push(yesOrNo);
  return votes;
};

//NOTE - 투표 리셋
const resetVote = (players) => {
  players.forEach((player) => {
    player.votedCount = 0;
    player.voteTo = "";
  });
};

//NOTE - 플레이어들이 받은 표 확인
const getPlayersVoteResult = (players) => {
  const voteResult = {};
  players.forEach((player) => {
    voteResult[player.userNickname] = player.votedCount;
  });
  return voteResult;
};

//NOTE - 표를 가장 많이 받은 플레이어 확인
const getMostVotedPlayer = (players) => {
  let sortedResult = [...players];
  let isValid;

  sortedResult.sort((a, b) => b.votedCount - a.votedCount);
  isValid = sortedResult[0].votedCount !== sortedResult[1].votedCount;

  return { isValid, result: sortedResult[0] };
};

//NOTE - 찬성 반대 투표 결과
const getYesOrNoVoteResult = (votes) => {
  let yesCount = 0;
  let noCount = 0;
  let isValid;

  votes.forEach((vote) => {
    //NOTE - 찬반 투표 셈
    if (vote === true) {
      yesCount++;
    } else {
      noCount++;
    }
  });

  isValid = yesCount !== noCount; //NOTE - 찬성과 반대가 동률인지 확인
  return {
    isValid,
    result: { confirm: yesCount > noCount, yesCount, noCount },
  }; //NOTE - 찬성과 반대가 다른 유효한 값인지, 찬성과 반대중 어떤게 더 많은지
};

//NOTE - 플레이어 죽임
const killCitizen = (players, index) => {
  players[index].isLived = false;

  return players[index];
};

//NOTE - 의사가 시민 살림
const saveCitizen = (players, index) => {
  players[index].isLived = true;
  return players[index];
};

const resetCitizenLifeCount = (players) => {
  players.forEach((player) => (player.lifeCount = 0));
};

//NOTE - 플레이어가 죽었는지 확인
const isPlayerDie = (players, index) => {
  return players[index].lifeCount === 0;
};
//NOTE - 사회자가 진행 상황 말함
const speak = (line) => {
  console.log(`사회자 : ${line}`);
};

//NOTE - 사회자가 플레이어의 카메라를 켬
const turnOnCamera = (players, index) => {
  players[index].isCameraOn = true;
};

//NOTE - 사회자가 플레이어의 카메라를 끔
const turnOffCamera = (players, index) => {
  players[index].isCameraOn = false;
};

//NOTE - 사회자가 플레이어의 마이크를 켬
const turnOnMike = (players, index) => {
  players[index].isMikeOn = true;
};

//NOTE - 사회자가 플레이어의 마이크를 끔
const turnOffMike = (players, index) => {
  players[index].isMikeO = false;
};

//NOTE - 경찰이 플레이어가 마피아 인지 알아냄
const checkPlayerMafia = (players, index) => {
  if (players[index].role === "마피아") {
    return true;
  } else {
    return false;
  }
};

//NOTE - 방나가기
const exit = (players, index) => {
  players[index].isLived = false;
};

//NOTE - 어느 팀이 이겼는지
const whoWins = (roles) => {
  const mafiaCount = roles["마피아"].length;
  const citizenCount = roles["시민"].length;

  if (mafiaCount === 0) {
    return { isValid: true, result: "시민" };
  }
  if (mafiaCount > citizenCount || mafiaCount === citizenCount) {
    //FIXME - 소괄호 씌워야 하나? 소괄호 씌워도 프리티어 때문에 사라짐
    return { isValid: false, result: "마피아" };
  }
};

//NOTE - 각 역할
const moderator = {
  setUserNickname,
  checkParticipantsCountEnough,
  checkAllParticipantsReady,
  canGameStart,
  gameStart,
  gameOver,
  startTimer,
  roundStart,
  roundOver,
  nightStart,
  nightOver,
  dayStart,
  dayOver,
  resetVote,
  getPlayersVoteResult,
  getMostVotedPlayer,
  getYesOrNoVoteResult,
  isPlayerDie,
  speak,
  shuffleParticipants,
  getRandomParticipant,
  resetCitizenLifeCount,
  setPlayerMafia,
  setPlayerDoctor,
  setPlayerPolice,
  setPlayerCitizen,
  setRoles,
  turnOnCamera,
  turnOffCamera,
  turnOnMike,
  turnOffMike,
  killCitizen,
  whoWins,
};
const citizen = {
  userNickname: "",
  role: "시민",
  index: -1,
  isLived: true,
  isCameraOn: true,
  isMikeOn: true,
  voteTo: "",
  votedCount: 0,
  setReady,
  voteToPlayer,
  voteYesOrNo,
  exit,
};
const mafia = {
  ...citizen,
  role: "마피아",
  killCitizen,
};
const police = {
  ...citizen,
  role: "경찰",
  checkPlayerMafia,
};
const doctor = {
  ...citizen,
  role: "의사",
  saveCitizen,
};

//NOTE - 방 참가자 (방에 들어와서 역할이 없는 상태)
const participant = { userNickname: "", isReady: false, index: -1 };

//NOTE - 참가자들 (역할 배정 전)
const participants = [];

//NOTE - 플레이어들 (역할이 정해짐)
const players = [];

//NOTE - 플레이어들 역할
const roles = {};

//NOTE - 플레이어들의 찬반 투표 결과
const votes = [];

//NOTE - 플레이어 방 정원
let userCount = -1;

//NOTE - 역할이 마피아인 플레이어 인덱스 목록
let mafiaIndexes;

//NOTE - 역할이 의사인 플레이어 인덱스 목록
let doctorIndexes;

//NOTE - 역할이 경찰인 플레이어 인덱스 목록
let policeIndexes;

//NOTE - 역할이 시민인 플레이어 인덱스 목록
let citizenIndexes;

//NOTE - 죽기로 결정된 플레이어
let killedPlayer;

//NOTE - 경찰이 조사한 플레이어가 마피아인지 여부
let isPlayerMafia;

//NOTE - 방을 나갈지 선택
let choiceToExit;

const gamePlay = () => {
  userCount = 5; //NOTE - 방 유저 정원 5명 결정
  //NOTE - 유저들 게임 참가
  for (let i = 0; i < userCount; i++) {
    participants[i] = { ...participant, userNickname: "user" + i, index: i };
  }

  //NOTE - 플레이어 수를 참가자들 수만큼 설정
  for (let i = 0; i < userCount; i++) {
    players[i] = null;
  }

  //NOTE - 모든 참가자들이 레디함
  for (let i = 0; i < userCount; i++) {
    participants[i].isReady = true;
  }

  const isAllParticipantsReady =
    moderator.checkAllParticipantsReady(participants); //NOTE - 참가자들이 전부 레디했는지
  const isAllParticipantsEnoughCount = moderator.checkParticipantsCountEnough(
    userCount,
    participants
  ); //NOTE - 참가자들이 방 정원을 채웠는지

  if (
    moderator.canGameStart(isAllParticipantsEnoughCount, isAllParticipantsReady) //NOTE - 게임이 시작 가능한 상태인지 확인
  ) {
    gameStart(); //NOTE - 게임 시작
  } else {
    console.log("게임 시작 불가"); //NOTE - 게임 시작 조건 못 갖춤
  }
  let randomParticipant;

  randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
  moderator.setPlayerMafia(players, randomParticipant); //NOTE - 참가자를 마피아 플레이어로 설정

  randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
  moderator.setPlayerMafia(players, randomParticipant); //NOTE - 참가자를 마피아 플레이어로 설정

  randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
  moderator.setPlayerDoctor(players, randomParticipant); //NOTE - 참가자를 의사 플레이어로 설정

  randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
  moderator.setPlayerPolice(players, randomParticipant); //NOTE - 참가자를 경찰 플레이어로 설정

  randomParticipant = moderator.getRandomParticipant(participants); //NOTE - 참가자들 중 한명 랜덤으로 뽑음
  moderator.setPlayerCitizen(players, randomParticipant); //NOTE - 참가자를 시민 플레이어로 설정

  moderator.setRoles(players, roles); //NOTE - 플레이어들의 역할들을 정리해서 저장

  moderator.roundStart();

  //NOTE - 모든 참가자들은 역할을 배정받고 플레이어로 변경 (매개 변수가 participant라서 이렇게 대처, 클래스면 게임 순서대로 구현 가능)
  moderator.nightStart(); //NOTE - 밤이 시작됨

  //NOTE - 모든 플레이어들 작업
  for (let index = 0; index < userCount; index++) {
    moderator.turnOffCamera(players, index); //NOTE - 모든 플레이어들 카메라 끔
    moderator.turnOffMike(players, index); //NOTE - 모든 플레이어들 마이크 끔
  }

  moderator.speak("마피아를 뽑겠습니다.");
  console.log("마피아 뽑음");

  moderator.speak("마피아 들은 고개를 들어 서로를 확인해 주세요.");
  mafiaIndexes = roles["마피아"]; //NOTE - 마피아 플레이어들

  mafiaIndexes.forEach((index) => moderator.turnOnCamera(players, index)); //NOTE - 마피아들 카메라 켬
  mafiaIndexes.forEach((index) => moderator.turnOnMike(players, index)); //NOTE - 마피아들 마이크 켬

  moderator.startTimer(90); //NOTE - 시간 재기

  mafiaIndexes.forEach((index) => moderator.turnOnCamera(players, index)); //NOTE - 마피아들 카메라 끔
  mafiaIndexes.forEach((index) => moderator.turnOnMike(players, index)); //NOTE - 마피아들 마이크 끔

  moderator.speak("고개를 숙이시구요. 이제 의사를 뽑겠습니다.");
  console.log("의사 뽑음");

  moderator.speak("네, 이제 경찰 뽑겠습니다.");
  console.log("경찰 뽑음");
  console.log("나머지는 시민으로 뽑음");

  for (let index = 0; index < userCount; index++) {
    moderator.turnOnCamera(players, index); //NOTE - 모든 플레이어들 카메라 켬
    moderator.turnOnMike(players, index); //NOTE - 모든 플레이어들 마이크 켬
  }

  moderator.speak("대화를 시작하세요.");
  moderator.startTimer(90); //NOTE - 시간 재기

  moderator.speak("그럼 여기서 마피아일 것 같은 사람의 화면을 클릭해주세요.");
  players[0].voteToPlayer(players, 0, 1); //NOTE - 0번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표
  players[1].voteToPlayer(players, 1, 2); //NOTE - 1번 인덱스 플레이어가 2번 인덱스 플레이어에게 투표
  players[2].voteToPlayer(players, 2, 1); //NOTE - 2번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표
  players[3].voteToPlayer(players, 3, 1); //NOTE - 3번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표
  players[4].voteToPlayer(players, 4, 1); //NOTE - 4번 인덱스 플레이어가 1번 인덱스 플레이어에게 투표

  moderator.speak("셋 둘 하나!(카운트다운)");
  moderator.startTimer(90); //NOTE - 시간 재기

  const votedPlayers = moderator.getPlayersVoteResult(players); //NOTE - 투표 결과 확인 (누가 얼마나 투표를 받았는지)
  const mostVotedPlayer = moderator.getMostVotedPlayer(players); //NOTE - 투표를 가장 많이 받은 사람 결과 (확정X, 동률일 가능성 존재)
  moderator.resetVote(players); //NOTE - 플레이어들이 한 투표 기록 리셋

  if (mostVotedPlayer.isValid) {
    //NOTE - 투표 성공
    moderator.speak("투표 결과는 다음과 같습니다.");
    console.log(votedPlayers);
    moderator.speak(
      `자, ${mostVotedPlayer.result.userNickname}이(가) 나왔습니다.`
    );
  } else {
    //NOTE - 투표 실패, 투표 결과가 동률인 경우
    console.log("투표 수가 동일한 사람이 있어서 투표가 실패했습니다.");
    console.log("투표 다시 시작");
  }

  moderator.speak(
    `${mostVotedPlayer.result.userNickname}님은 자신이 지목 되었으므로 자신이 마피아가 아닌 이유를 설명해보세요.`
  );

  moderator.startTimer(90); //NOTE - 시간 재기

  moderator.speak(
    `${mostVotedPlayer.result.userNickname}님이 마피아인지 투표해주세요.`
  );

  moderator.startTimer(90); //NOTE - 시간 재기

  players[0].voteYesOrNo(votes, false); //NOTE - 0번 인덱스 플레이어가 찬성에 투표
  players[1].voteYesOrNo(votes, true); //NOTE - 1번 인덱스 플레이어가 찬성에 투표
  players[2].voteYesOrNo(votes, true); //NOTE - 2번 인덱스 플레이어가 찬성에 투표
  players[3].voteYesOrNo(votes, false); //NOTE - 3번 인덱스 플레이어가 반대에 투표
  players[4].voteYesOrNo(votes, false); //NOTE - 4번 인덱스 플레이어가 반대에 투표

  const yesOrNoVoteResult = moderator.getYesOrNoVoteResult(votes); //NOTE - 찬반 투표 결과 (확정X, 동률 나올 수 있음)

  if (yesOrNoVoteResult.isValid) {
    //NOTE - 투표 성공, 동률 아님
    yesOrNoVoteResult.result.confirm //NOTE - 투표 결과 찬성이 과반수인지 반대가 과반수인지 출력
      ? moderator.speak(
          `${mostVotedPlayer.result.userNickname}님이 마피아인 것으로 투표가 나왔습니다.\n찬성 : ${yesOrNoVoteResult.result.yesCount} 반대 : ${yesOrNoVoteResult.result.noCount}`
        )
      : moderator.speak(
          `${mostVotedPlayer.result.userNickname}님이 마피아가 아닌 것으로 투표가 나왔습니다.\n\n찬성 : ${yesOrNoVoteResult.result.yesCount} 반대 : ${yesOrNoVoteResult.result.noCount}`
        );
  } else {
    //NOTE - 투표 실패, 동률이 나옴
    console.log("동률 나옴");
  }

  moderator.roundOver(); //NOTE - 라운드 종료

  moderator.nightStart(); //NOTE - 밤이 시작됨 (이전에 밤이 끝나지 않았음)
  moderator.roundStart(); //NOTE - 라운드 시작

  //NOTE - 모든 플레이어들 작업
  for (let index = 0; index < userCount; index++) {
    moderator.turnOffCamera(players, index); //NOTE - 모든 플레이어들 카메라 끔
    moderator.turnOffMike(players, index); //NOTE - 모든 플레이어들 마이크 끔
  }

  killedPlayer = moderator.killCitizen(players, mostVotedPlayer.result.index);

  if (killedPlayer.role === "마피아") {
    moderator.speak("마피아가 죽었습니다.");
  } else {
    moderator.speak("무고한 시민이 죽었습니다.");
  }

  setRoles(players, roles);

  moderator.speak("마피아는 일어나서 누구를 죽일지 결정해주세요.");

  mafiaIndexes.forEach((index) => moderator.turnOnCamera(players, index)); //NOTE - 마피아들 카메라 켬
  mafiaIndexes.forEach((index) => moderator.turnOnMike(players, index)); //NOTE - 마피아들 마이크 켬

  moderator.startTimer(90); //NOTE - 시간 재기
  killedPlayer = players[mafiaIndexes[0]].killCitizen(players, 0); //NOTE - 0번 인덱스 플레이어가 마피아가 아니라고 가정하고 0번 인덱스 플레이어 죽임

  mafiaIndexes.forEach((index) => moderator.turnOnCamera(players, index)); //NOTE - 마피아들 카메라 끔
  mafiaIndexes.forEach((index) => moderator.turnOnMike(players, index)); //NOTE - 마피아들 마이크 끔

  moderator.speak("이제 의사는 일어나서 누구를 살릴 지 결정해주세요.");

  doctorIndexes = roles["의사"]; //NOTE - 역할이 의사인 플레이어 인덱스 반환 (다수인 경우 상정)
  //FIXME - 화면 켜짐이 나오는데 카메라 이야기인가요?
  moderator.startTimer(90); //NOTE - 시간 재기

  moderator.speak("이제 경찰은 일어나서 마피아 의심자를 결정해주세요.");
  //FIXME - 화면 켜짐이 나오는데 카메라 이야기인가요?

  policeIndexes = roles["경찰"];

  isPlayerMafia = players[policeIndexes[0]].checkPlayerMafia(players, 0); //NOTE - 0번 인덱스 플레이어가 마피아인지 의심

  //FIXME - 경찰에게만 하는 말인데 고칠 것
  if (isPlayerMafia) {
    moderator.speak("해당 플레이어는 마피아가 맞습니다.");
  } else {
    moderator.speak("해당 플레이어는 마피아가 아닙니다.");
  }

  moderator.roundOver(); //NOTE - 라운드 종료
  moderator.roundStart(); //NOTE - 라운드 시작

  //NOTE - 모든 플레이어에 대해서 작업
  for (let index = 0; index < userCount; index++) {
    moderator.turnOnCamera(players, index); //NOTE - 카메라를 켬
    moderator.turnOnMike(players, index); //NOTE - 마이크를 켬
  }

  if (killedPlayer.isLived) {
    moderator.speak("간밤에 아무도 죽지 않았습니다.");
  } else {
    moderator.speak(`간밤에 ${killedPlayer.userNickname}님이 죽었습니다.`);
    setRoles(players, roles); //NOTE - 역할에 속하는 플레이어들 다시 설정
  }

  moderator.speak("게임을 관전 하시겠습니까? 아니면 나가시겠습니까?");
  choiceToExit = true; //NOTE - 나간다고 가정

  if (choiceToExit) {
    //NOTE - 방을 나갈지 관전할지 선택
    exit(players, killedPlayer.index); //NOTE - 플레이어는 방을 나감, 중간에 나가는 경우에도 사용할 수 있음
  }

  moderator.roundOver(); //NOTE - 라운드 종료

  if (moderator.whoWins.isValid) {
    //NOTE - 게임 종료 만족하는 지
    console.log(`${moderator.whoWins.result} 팀이 이겼습니다.`); //NOTE - 어느 팀이 이겼는지 결정 남
    gameOver(); //NOTE - 게임 종료
  }
};
gamePlay();
