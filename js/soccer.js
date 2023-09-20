var isProfilContentSelected = true;
var isPositionContentSelected = false;
var isOrientationContentSelected = false;
var isExportContentSelected = false;
var isFirstPinPointSelected = false;
var rowCount = 0;
var deleteNum = 0;

var pinPointCount = 0;
var pinPointDataEntry = { 
    x: 0, 
    y: 0, 
    x1: 0, 
    y1: 0, 
    label: '', 
    player: '', 
    receiver: '',
    frame: 1, 
    home_team: '', 
    away_team: '',
    date: '',
    team_analyzed: 'home',
    sense_of_attack: 'right',
    deleted: false
};
var pinPointData = [];

function initpinPointDataEntry() {
    pinPointDataEntry = { 
        x: 0, 
        y: 0, 
        x1: 0, 
        y1: 0, 
        label: '', 
        player: '',
        receiver: '', 
        frame: 1, 
        home_team: '', 
        away_team: '',
        date: '',
        team_analyzed: 'home',
        sense_of_attack: 'right',
        deleted: false
    };

    pinPointDataEntry.home_team = document.getElementById('home_team_input').value.trim();
    pinPointDataEntry.away_team = document.getElementById('away_team_input').value.trim();
    pinPointDataEntry.date = document.getElementById('date_input').value.trim();
    pinPointDataEntry.team_analyzed = document.getElementById('select_team_input').value.trim();
    pinPointDataEntry.sense_of_attack = document.getElementById('select_sense_attack_input').value.trim();
    pinPointDataEntry.frame = document.getElementById('frame_input').value.trim();
}

function checkProfil() {
    var homeTeam = document.getElementById('home_team_input').value.trim();
    var awayTeam = document.getElementById('away_team_input').value.trim();
    var date = document.getElementById('date_input').value.trim();
    var frame = document.getElementById('frame_input').value.trim();
    var analyzed = document.getElementById('select_team_input').value.trim();
    var senseOfAttack = document.getElementById('select_sense_attack_input').value.trim();
    var flag = 1;

    if(homeTeam === '' || awayTeam === '' || date === '') {
        return 0;
    }

    var homeTeamPlayers = document.getElementsByClassName('player_name_input1');
    var awayTeamPlayers = document.getElementsByClassName('player_name_input2');

    for(player of homeTeamPlayers) {
        if(player.value.trim() === '') {
            flag = 0;
            break;
        }
    }

    for(player of awayTeamPlayers) {
        if(player.value.trim() === '') {
            flag = 0;
            break;
        }
    }

    return flag;
}

function showTopContent(contentId) {
    if(!checkProfil() && contentId !== 'profil_content') {
        var toast = new bootstrap.Toast(document.getElementById('myToast'));
        document.getElementById('toast_body').innerHTML = 'Please complete your profil';
        toast.show();
        return;
    }

    if(contentId === 'export_content') {
        var deleteRowModal = new bootstrap.Modal(document.getElementById('confirm_modal'));
        var deleteRowBtns = document.getElementsByClassName('delete-row-btn');

        for(let btn of deleteRowBtns) {
            btn.addEventListener('click', function() {
                deleteRowModal.show();
                deleteNum = btn.id;
            });
        }

        var deleteRow = document.getElementById('delete_row_btn');
        deleteRow.addEventListener('click', function() {
            const elems = document.querySelectorAll(`.btn_${deleteNum}`);
            for(const elem of elems) {
                elem.parentNode.removeChild(elem);
                pinPointData[deleteNum].deleted = true;
                deleteRowModal.hide();
            }
        })
    }

    var homeTeamPlayers = document.getElementsByClassName('player_name_input1');
    var awayTeamPlayers = document.getElementsByClassName('player_name_input2');
    var playerBtns = document.getElementsByClassName('player-btn');
    var passerBtns = document.getElementsByClassName('passer-btn');
    var receiverBtns = document.getElementsByClassName('receiver-btn');

    if(contentId === 'position_pitch_content' || contentId === 'orientation_pitch_content') {
        if(document.getElementById('select_team_input').value.trim() === 'home') {
            for(let i = 0; i < playerBtns.length; i ++) {
                playerBtns[i].innerHTML = homeTeamPlayers[i].value.trim();
                passerBtns[i].innerHTML = homeTeamPlayers[i].value.trim();
                receiverBtns[i].innerHTML = homeTeamPlayers[i].value.trim();
            }    
        } else {
            for(let i = 0; i < playerBtns.length; i ++) {
                playerBtns[i].innerHTML = awayTeamPlayers[i].value.trim();
                passerBtns[i].innerHTML = awayTeamPlayers[i].value.trim();
                receiverBtns[i].innerHTML = awayTeamPlayers[i].value.trim();
            }    
        }
    }

    var topDivs = document.querySelectorAll('.top-div');
    topDivs.forEach(function(div) {
        div.style.display = 'none';
    });

    var selectedDiv = document.getElementById(contentId);
    selectedDiv.style.display = 'block';

    var buttons = document.querySelectorAll('.bottom-btn');
    buttons.forEach(function(button) {
        button.classList.remove('active');
    });

    var clickedButton = document.querySelector('button[data-id="' + contentId + '"]');
    clickedButton.classList.add('active');

    if(contentId === 'profil_content') {
        isProfilContentSelected = true;
        isPositionContentSelected = false;
        isOrientationContentSelected = false;
        isExportContentSelected = false;
        isFirstPinPointSelected = false;
    } else if(contentId === 'position_pitch_content') {
        isProfilContentSelected = false;
        isPositionContentSelected = true;
        isOrientationContentSelected = false;
        isExportContentSelected = false;
        isFirstPinPointSelected = false;
    } else if(contentId === 'orientation_pitch_content') {
        isProfilContentSelected = false;
        isPositionContentSelected = false;
        isOrientationContentSelected = true;
        isExportContentSelected = false;
        isFirstPinPointSelected = false;
    } else if(contentId === 'export_content') {
        isProfilContentSelected = false;
        isPositionContentSelected = false;
        isOrientationContentSelected = false;
        isExportContentSelected = true;
        isFirstPinPointSelected = false;
    } else {}

    initpinPointDataEntry();
    pinPointCount = 0;
}

function scaleCoordinate(value, max) {
    return (value / max) * 100;
}

function placePinPointForPosition(event) {
    const positioniPitchContent = document.getElementById("position_pitch_content");
    const pitchWidth = positioniPitchContent.clientWidth;
    const pitchHeight = positioniPitchContent.clientHeight;
    const x = scaleCoordinate(event.clientX - positioniPitchContent.offsetLeft, pitchWidth);
    const y = scaleCoordinate(event.clientY - positioniPitchContent.offsetTop, pitchHeight);
    const sendOfAttack = document.getElementById('select_sense_attack_input').value.trim();
  
    if(sendOfAttack === 'right') {
        pinPointDataEntry.x = x;
        pinPointDataEntry.y = y;
    
    } else {
        pinPointDataEntry.x = 100 - x;
        pinPointDataEntry.y = 100 - y;    
    }

    pinPointDataEntry.x1 = 0;
    pinPointDataEntry.y1 = 0;
}

function placePinPointForOrientation(event, orientationFirstModal) {
    const positioniPitchContent = document.getElementById("orientation_pitch_content");
    const pitchWidth = positioniPitchContent.clientWidth;
    const pitchHeight = positioniPitchContent.clientHeight;
    const x = scaleCoordinate(event.clientX - positioniPitchContent.offsetLeft, pitchWidth);
    const y = scaleCoordinate(event.clientY - positioniPitchContent.offsetTop, pitchHeight);
    const sendOfAttack = document.getElementById('select_sense_attack_input').value.trim();

    if(isFirstPinPointSelected) {
        if(sendOfAttack === 'right') {
            pinPointDataEntry.x1 = x;
            pinPointDataEntry.y1 = y;    
        } else {
            pinPointDataEntry.x1 = 100 - x;
            pinPointDataEntry.y1 = 100 - y;    
        }

        orientationFirstModal.show();
        isFirstPinPointSelected = false;
    } else {
        if(sendOfAttack === 'right') {
            pinPointDataEntry.x = x;
            pinPointDataEntry.y = y;    
        } else {
            pinPointDataEntry.x = 100 - x;
            pinPointDataEntry.y = 100 - y;    
        }

        isFirstPinPointSelected = true;
    }
}

function cancelModal() {

}

function addRowToExportTable(pinPointDataEntry) {
    var exportTable = document.getElementById('export_table');
    var row = exportTable.insertRow(-1);

    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    var cell4 = row.insertCell(4);
    var cell5 = row.insertCell(5);
    var cell6 = row.insertCell(6);
    var cell7 = row.insertCell(7);
    var cell8 = row.insertCell(8);
    var cell9 = row.insertCell(9);
    var cell10 = row.insertCell(10);
    var cell11 = row.insertCell(11);
    var cell12 = row.insertCell(12);
    var cell13 = row.insertCell(13);

    cell0.innerHTML = pinPointDataEntry.x;
    cell1.innerHTML = pinPointDataEntry.y;
    cell2.innerHTML = pinPointDataEntry.x1;
    cell3.innerHTML = pinPointDataEntry.y1;
    cell4.innerHTML = pinPointDataEntry.label;
    cell5.innerHTML = pinPointDataEntry.player;
    cell6.innerHTML = pinPointDataEntry.receiver;
    cell7.innerHTML = pinPointDataEntry.frame;
    cell8.innerHTML = pinPointDataEntry.home_team;
    cell9.innerHTML = pinPointDataEntry.away_team;
    cell10.innerHTML = pinPointDataEntry.date;
    cell11.innerHTML = pinPointDataEntry.team_analyzed;
    cell12.innerHTML = pinPointDataEntry.sense_of_attack;
    cell13.innerHTML = '<button type="button" class="btn-close delete-row-btn" aria-label="Close" id="' + `${rowCount}` + '"></button>';

    row.classList.add(`btn_${rowCount}`);

    rowCount ++;
}

function drawLine(x, y, x1, y1, type) {
    var bla = "";
    var lineLength = Math.sqrt( (x-x1)*(x-x1)+(y-y1)*(y-y1) );
    var color = 'green';

    if(type === 'success pass') {
        color = 'orange';
    } else if(type === 'failed pass') {
        color = 'red';
    } else if(type === 'progress') {
        color = 'blue';
    } else if(type === 'call') {
        color = 'yellow';
    } else {}
    
    for( var i = 0; i < lineLength; i ++ )
    {
        bla += "<div class='" + `btn_${rowCount}` + "' style='z-index:0; position:absolute; left:"+ Math.round( x + (x1 - x) * i / lineLength ) +"px;top:"+ Math.round( y + ( y1 - y ) * i / lineLength  ) +"px;width:1px;height:1px;background:" + color + "'></div>";
    }
    document.getElementById('orientation_pitch_content').innerHTML += bla;
}

function openModals() {
    //  pitches
    const positionPitchContent = document.getElementById('position_pitch_content');
    const orientationPitchContent = document.getElementById('orientation_pitch_content');
    //  modals
    const positionFirstModal = new bootstrap.Modal(document.getElementById('position-first-modal'));
    const positionPlayerModal = new bootstrap.Modal(document.getElementById('position-player-modal'));
    const orientationFirstModal = new bootstrap.Modal(document.getElementById('orientation-first-modal'));
    const orientationPasserModal = new bootstrap.Modal(document.getElementById('orientation-passer-modal'));
    const orientationReceiverModal = new bootstrap.Modal(document.getElementById('orientation-receiver-modal'));
    const homeTeamPlayerModal = new bootstrap.Modal(document.getElementById('home_team_player_modal'));
    const awayTeamPlayerModal = new bootstrap.Modal(document.getElementById('away_team_player_modal'));
    
    positionPitchContent.addEventListener('click', function(event) {
        placePinPointForPosition(event);
        positionFirstModal.show();
    });

    orientationPitchContent.addEventListener('click', function(event) {
        placePinPointForOrientation(event, orientationFirstModal);
    });

    //  position
    const recoveryBtn = document.getElementById('recovery_btn');
    const lossBtn = document.getElementById('loss_btn');
    const threeLossBtn = document.getElementById('three_loss_btn');

    recoveryBtn.addEventListener('click', function() {
        positionFirstModal.hide();
        positionPlayerModal.show();

        pinPointDataEntry.label = 'recovery';
    });

    lossBtn.addEventListener('click', function() {
        positionFirstModal.hide();
        positionPlayerModal.show();

        pinPointDataEntry.label = 'loss';
    });

    threeLossBtn.addEventListener('click', function() {
        positionFirstModal.hide();
        positionPlayerModal.show();

        pinPointDataEntry.label = 'loss(+3 touches)';
    });

    const playerBtns = document.getElementsByClassName('player-btn');

    for(let playerBtn of playerBtns) {
        playerBtn.addEventListener('click', function() {
            positionPlayerModal.hide();
            
            pinPointDataEntry.player = playerBtn.innerHTML;
            pinPointDataEntry.frame = document.getElementById('frame_input').value.trim();

            const pinpoint = document.createElement("div");
            if(pinPointDataEntry.label === 'recovery') {
                pinpoint.className = `pinpoint01 btn_${rowCount}`;

            } else if(pinPointDataEntry.label === 'loss') {
                pinpoint.className = `pinpoint02 btn_${rowCount}`;
                
            } else if(pinPointDataEntry.label === 'loss(+3 touches)') {
                pinpoint.className = `pinpoint03 btn_${rowCount}`;
            } else {}

            pinpoint.setAttribute('title', `${pinPointDataEntry.player}, ${pinPointDataEntry.label}`);
            pinpoint.style.left = pinPointDataEntry.x * document.getElementById("position_pitch_content").clientWidth / 100 + "px";
            pinpoint.style.top = pinPointDataEntry.y * document.getElementById("position_pitch_content").clientHeight / 100 + "px";
            positionPitchContent.appendChild(pinpoint);

            pinPointData.push(pinPointDataEntry);

            addRowToExportTable(pinPointDataEntry);
            initpinPointDataEntry();
        });
    }

    //  orientation
    const successPassBtn = document.getElementById('success_pass_btn');
    const failedPassBtn = document.getElementById('failed_pass_btn');
    const progressBtn = document.getElementById('progress_btn');
    const callBtn = document.getElementById('call_btn');

    successPassBtn.addEventListener('click', function() {
        orientationFirstModal.hide();
        document.getElementById('orientation_player_modal_body').innerHTML = 'PASSERS(ORIENTATION)';
        orientationPasserModal.show();

        pinPointDataEntry.label = 'success pass';
    });

    failedPassBtn.addEventListener('click', function() {
        orientationFirstModal.hide();
        document.getElementById('orientation_player_modal_body').innerHTML = 'PASSERS(ORIENTATION)';
        orientationPasserModal.show();

        pinPointDataEntry.label = 'failed pass';
    });

    progressBtn.addEventListener('click', function() {
        orientationFirstModal.hide();
        document.getElementById('orientation_player_modal_body').innerHTML = 'PLAYERS(ORIENTATION)';
        orientationPasserModal.show();

        pinPointDataEntry.label = 'progress';
    });

    callBtn.addEventListener('click', function() {
        orientationFirstModal.hide();
        document.getElementById('orientation_player_modal_body').innerHTML = 'PLAYERS(ORIENTATION)';
        orientationPasserModal.show();

        pinPointDataEntry.label = 'call';
    });

    const passerBtns = document.getElementsByClassName('passer-btn');

    for(let passerBtn of passerBtns) {
        passerBtn.addEventListener('click', function() {
            pinPointDataEntry.player = passerBtn.innerHTML;
            if(pinPointDataEntry.label === 'progress' || pinPointDataEntry.label === 'call') {
                orientationPasserModal.hide();

                // pinPointDataEntry.receiver = receiverBtn.innerHTML;
                pinPointDataEntry.frame = document.getElementById('frame_input').value.trim();
    
                var posX = pinPointDataEntry.x * document.getElementById("orientation_pitch_content").clientWidth / 100;
                var posY = pinPointDataEntry.y * document.getElementById("orientation_pitch_content").clientHeight / 100;
                var posX1 = pinPointDataEntry.x1 * document.getElementById("orientation_pitch_content").clientWidth / 100;
                var posY1 = pinPointDataEntry.y1 * document.getElementById("orientation_pitch_content").clientHeight / 100;
    
                const pinpoint1 = document.createElement("div");
                pinpoint1.className = `pinpoint1 btn_${rowCount}`;
                pinpoint1.setAttribute('title', `${pinPointDataEntry.player}, player, ${pinPointDataEntry.label}`);
                pinpoint1.style.left = ( posX - 5 ) + "px";
                pinpoint1.style.top = ( posY - 5 ) + "px";
                orientationPitchContent.appendChild(pinpoint1);
    
                const pinpoint2 = document.createElement("div");
                pinpoint2.className = `pinpoint2 btn_${rowCount}`;
                pinpoint2.setAttribute('title', `${pinPointDataEntry.player}, player, ${pinPointDataEntry.label}`);
                pinpoint2.style.left = ( posX1 - 5 ) + "px";
                pinpoint2.style.top = ( posY1 - 5 ) + "px";
                orientationPitchContent.appendChild(pinpoint2);
    
                drawLine(posX, posY, posX1, posY1, pinPointDataEntry.label);
                pinPointData.push(pinPointDataEntry);
    
                addRowToExportTable(pinPointDataEntry);
                initpinPointDataEntry();
            } else {
                orientationPasserModal.hide();
                document.getElementById('orientation_player_modal_body').innerHTML = 'PASSERS(ORIENTATION)';
                orientationReceiverModal.show();    
            }

        });
    }

    const receiverBtns = document.getElementsByClassName('receiver-btn');

    for(let receiverBtn of receiverBtns) {
        receiverBtn.addEventListener('click', function() {
            orientationReceiverModal.hide();
            
            pinPointDataEntry.receiver = receiverBtn.innerHTML;
            pinPointDataEntry.frame = document.getElementById('frame_input').value.trim();

            var posX = pinPointDataEntry.x * document.getElementById("orientation_pitch_content").clientWidth / 100;
            var posY = pinPointDataEntry.y * document.getElementById("orientation_pitch_content").clientHeight / 100;
            var posX1 = pinPointDataEntry.x1 * document.getElementById("orientation_pitch_content").clientWidth / 100;
            var posY1 = pinPointDataEntry.y1 * document.getElementById("orientation_pitch_content").clientHeight / 100;

            const pinpoint1 = document.createElement("div");
            pinpoint1.className = `pinpoint1 btn_${rowCount}`;
            pinpoint1.setAttribute('title', `${pinPointDataEntry.player}, passer, ${pinPointDataEntry.label}`);
            pinpoint1.style.left = ( posX - 5 ) + "px";
            pinpoint1.style.top = ( posY - 5 ) + "px";
            orientationPitchContent.appendChild(pinpoint1);

            const pinpoint2 = document.createElement("div");
            pinpoint2.className = `pinpoint2 btn_${rowCount}`;
            pinpoint2.setAttribute('title', `${pinPointDataEntry.player}, receiver, ${pinPointDataEntry.label}`);
            pinpoint2.style.left = ( posX1 - 5 ) + "px";
            pinpoint2.style.top = ( posY1 - 5 ) + "px";
            orientationPitchContent.appendChild(pinpoint2);

            drawLine(posX, posY, posX1, posY1, pinPointDataEntry.label);
            pinPointData.push(pinPointDataEntry);

            addRowToExportTable(pinPointDataEntry);
            initpinPointDataEntry();
        });
    }

    //  open home team modal
    var openHomeTeamModalBtn = document.getElementById('home_team_player_modal_btn');
    openHomeTeamModalBtn.addEventListener('click', function() {
        awayTeamPlayerModal.hide();
        homeTeamPlayerModal.show();
    });
    //  open away team modal
    var openAwayTeamModalBtn = document.getElementById('away_team_player_modal_btn');
    openAwayTeamModalBtn.addEventListener('click', function() {
        homeTeamPlayerModal.hide();
        awayTeamPlayerModal.show();
    });


    var awayTeamPlayers = document.getElementsByClassName('player_name_input2');
    for(player of awayTeamPlayers) {
        if(player.value.trim() === '') {
            flag = 0;
            break;
        }
    }

    //  save home team player names
    document.getElementById('close_home_team_player_modal_btn').addEventListener('click', function() {
        var homeTeamPlayers = document.getElementsByClassName('player_name_input1');
        var flag = 1;

        for(player of homeTeamPlayers) {
            if(player.value.trim() === '') {
                flag = 0;
                break;
            }
        }

        if(!flag) {
            var toast = new bootstrap.Toast(document.getElementById('myToast'));
        document.getElementById('toast_body').innerHTML = 'Please insert home team player names';

            toast.show();
            return;
        }

        homeTeamPlayerModal.hide();

        //  cancel modals
        var modalCancelBtns = document.getElementsByClassName('cancel-modal-btn');
        for(let modalCancelBtn of modalCancelBtns) {
            modalCancelBtn.addEventListener('click', function() {
                initpinPointDataEntry();
            });
        }
    });

    //  save away team player names
    document.getElementById('close_away_team_player_modal_btn').addEventListener('click', function() {
        var awayTeamPlayers = document.getElementsByClassName('player_name_input2');
        var flag = 1;

        for(player of awayTeamPlayers) {
            if(player.value.trim() === '') {
                flag = 0;
                break;
            }
        }

        if(!flag) {
            var toast = new bootstrap.Toast(document.getElementById('myToast'));
            document.getElementById('toast_body').innerHTML = 'Please insert away team player names';
            toast.show();
            return;
        }

        awayTeamPlayerModal.hide();
    });

}
  
function exportPinpointCoordinatesToCSV() {
    const coordinates = pinPointData.map(
        ({ x, y, x1, y1, label, player, receiver, frame, home_team, away_team, date, team_analyzed, sense_of_attack, deleted }) => [x, y, x1, y1, label, player, receiver, frame, home_team, away_team, date, team_analyzed, sense_of_attack, deleted]
    );

    let csvContent = "x, y, x1, y1, label, player, receiver, frame, home_team, away_team, date, team_analyzed, sense_of_attack\n";
    for (const [x, y, x1, y1, label, player, receiver, frame, home_team, away_team, date, team_analyzed, sense_of_attack, deleted] of coordinates) {
        if(!deleted) {
            csvContent += `${x},${y},${x1},${y1}, ${label}, ${player}, ${receiver}, ${frame}, ${home_team}, ${away_team}, ${date}, ${team_analyzed}, ${sense_of_attack} \n`;
        }
    }
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pinpoints.csv";
    a.click();
}

showTopContent('profil_content');
openModals();