const players = [
    { id: 1, name: '炒飯', image: 'img/cha-han1.png', position: 1  },
    { id: 2, name: 'カレー', image: 'img/food_curry_sarasara.png', position: 1  },
    { id: 3, name: 'ハンバーグ', image: 'img/food_hamburg.png', position: 1  },
    { id: 4, name: 'オムライス', image: 'img/omurice.png', position: 1  },
    { id: 5, name: 'カツオ', image: 'img/sushi_katuo.png', position: 1  },
  ];
  
  const events = [
    { name: "今日は食欲旺盛！やる気で２マス進めた", move: 2, cell: 3 },
    { name: "思ったより食費が高くて気持ちが落ち込む。１マス戻る", move: -1, cell: 6 },
    { name: "おいしい食材を見つけた。２マス進む", move: 2, cell: 9 },
    { name: "家族からの応援をうける。５マス戻る", move: -5, cell: 12 },
    { name: "お父さんが、ハーゲンダッツを買ってきた。２マス進む", move: 2, cell: 18 },
  ];
  
  new Vue({
    el: "#app",
    data: {
      cells: Array(25).fill().map((_, index) => index + 1),
      dice: "",
      events: events.map(event => event.cell),
      isGameOver: false,
      turn: 1, //サイコロを振る順番を管理
      played: "",//サイコロを振った人を管理
      selectedPlayers: null, //プレイヤーの人数
      selectNumber: 1, //現在、選んだプレイヤーの人数
      highlightedIndex: null,//ホバー時に明るくする画像のindex
      players: players,
      selectedCharacters: [],//選択したキャラクター
      isAllSelected: false //キャラクター選択が完了したかのフラグ
    },
    methods: {
      highlightImage(index) {//highlightedIndexを変える処理
        this.highlightedIndex = index;
      },
      selectPlayers(num) {//プレイヤーの人数
        this.selectedPlayers = num;
      },
      isCharaSelected(index){//選択したキャラクターかどうかチェック
        let ids = this.selectedCharacters.map(character => character.id);
        return ids.includes(index)
      },
      CharacterName(index){
        if (this.selectedCharacters[index - 1]) {
          return `${this.selectedCharacters[index - 1].name}`;
        }
      },
      CharacterPositon(index) {
        if (this.selectedCharacters[index - 1]) {
          return this.selectedCharacters[index - 1].position;
        } 
      },//プレイヤーの選択
      selectCharacter(player) {
        this.selectedCharacters.push(player);
        if (this.selectedCharacters.length === this.selectedPlayers) {
          this.isAllSelected = true;
          return 
        }
        this.selectNumber += 1;
      },
      rollDice() {
        const dice = Math.floor(Math.random() * 6) + 1;
        this.dice = dice;
        this.movePlayer(dice, this.turn-1);
        this.turn = this.turn % this.selectedCharacters.length + 1;
        this.played = this.played % this.selectedCharacters.length + 1
      },
      movePlayer(dice, index) {
        const newPosition = Math.min(this.selectedCharacters[index].position + dice, 25);
        const move = setInterval(() => {
          dice > 0 ? this.selectedCharacters[index].position += 1 : this.selectedCharacters[index].position -= 1;
          if (this.selectedCharacters[index].position == newPosition) {
            setTimeout(() => {
              this.event(this.selectedCharacters[index].position, index);
            }, 500);
            clearInterval(move);
          }
  
          if (this.selectedCharacters[index].position === 25) {
            this.isGameOver = true;
            setTimeout(() => {
              alert(`プレイヤー${index+1}:${this.selectedCharacters[index].name}の勝ち！！`);
            }, 500);
          }
        }, 500);
      },
      event(position, index) {
        for (const event of events) {
          if (position == event.cell) {
            alert(event.name);
            this.movePlayer(event.move, index);
          }
        }
      }
    }
  });