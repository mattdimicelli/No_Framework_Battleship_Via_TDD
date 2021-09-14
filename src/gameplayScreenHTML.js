const html = `
        <div class="main-container">
            <header class="game-header">
                <div class="game-title-container">
                    <h1 class="game-title">BATTLESHIP</h1>
                </div>
                <h2 class="status"></h2>
                <a href="#" class="volume"></a>
            </header>
            <div class="game-board-container">
                <div class="board-and-label-container">
                    <h2 class="board-label">FRIENDLY FLEET</h2>
                    <div class="game-player-board">
                        <div class="cell player A1"><span class="invisible-dot">•</span></div>
                        <div class="cell player A2"><span class="invisible-dot">•</span></div>
                        <div class="cell player A3"><span class="invisible-dot">•</span></div>
                        <div class="cell player A4"><span class="invisible-dot">•</span></div>
                        <div class="cell player A5"><span class="invisible-dot">•</span></div>
                        <div class="cell player A6"><span class="invisible-dot">•</span></div>
                        <div class="cell player A7"><span class="invisible-dot">•</span></div>
                        <div class="cell player A8"><span class="invisible-dot">•</span></div>
                        <div class="cell player A9"><span class="invisible-dot">•</span></div>
                        <div class="cell player A10"><span class="invisible-dot">•</span></div>
                        <div class="cell player B1"><span class="invisible-dot">•</span></div>
                        <div class="cell player B2"><span class="invisible-dot">•</span></div>
                        <div class="cell player B3"><span class="invisible-dot">•</span></div>
                        <div class="cell player B4"><span class="invisible-dot">•</span></div>
                        <div class="cell player B5"><span class="invisible-dot">•</span></div>
                        <div class="cell player B6"><span class="invisible-dot">•</span></div>
                        <div class="cell player B7"><span class="invisible-dot">•</span></div>
                        <div class="cell player B8"><span class="invisible-dot">•</span></div>
                        <div class="cell player B9"><span class="invisible-dot">•</span></div>
                        <div class="cell player B10"><span class="invisible-dot">•</span></div>
                        <div class="cell player C1"><span class="invisible-dot">•</span></div>
                        <div class="cell player C2"><span class="invisible-dot">•</span></div>
                        <div class="cell player C3"><span class="invisible-dot">•</span></div>
                        <div class="cell player C4"><span class="invisible-dot">•</span></div>
                        <div class="cell player C5"><span class="invisible-dot">•</span></div>
                        <div class="cell player C6"><span class="invisible-dot">•</span></div>
                        <div class="cell player C7"><span class="invisible-dot">•</span></div>
                        <div class="cell player C8"><span class="invisible-dot">•</span></div>
                        <div class="cell player C9"><span class="invisible-dot">•</span></div>
                        <div class="cell player C10"><span class="invisible-dot">•</span></div>
                        <div class="cell player D1"><span class="invisible-dot">•</span></div>
                        <div class="cell player D2"><span class="invisible-dot">•</span></div>
                        <div class="cell player D3"><span class="invisible-dot">•</span></div>
                        <div class="cell player D4"><span class="invisible-dot">•</span></div>
                        <div class="cell player D5"><span class="invisible-dot">•</span></div>
                        <div class="cell player D6"><span class="invisible-dot">•</span></div>
                        <div class="cell player D7"><span class="invisible-dot">•</span></div>
                        <div class="cell player D8"><span class="invisible-dot">•</span></div>
                        <div class="cell player D9"><span class="invisible-dot">•</span></div>
                        <div class="cell player D10"><span class="invisible-dot">•</span></div>  
                        <div class="cell player E1"><span class="invisible-dot">•</span></div>
                        <div class="cell player E2"><span class="invisible-dot">•</span></div>
                        <div class="cell player E3"><span class="invisible-dot">•</span></div>
                        <div class="cell player E4"><span class="invisible-dot">•</span></div>
                        <div class="cell player E5"><span class="invisible-dot">•</span></div>
                        <div class="cell player E6"><span class="invisible-dot">•</span></div>
                        <div class="cell player E7"><span class="invisible-dot">•</span></div>
                        <div class="cell player E8"><span class="invisible-dot">•</span></div>
                        <div class="cell player E9"><span class="invisible-dot">•</span></div>
                        <div class="cell player E10"><span class="invisible-dot">•</span></div>
                        <div class="cell player F1"><span class="invisible-dot">•</span></div>
                        <div class="cell player F2"><span class="invisible-dot">•</span></div>
                        <div class="cell player F3"><span class="invisible-dot">•</span></div>
                        <div class="cell player F4"><span class="invisible-dot">•</span></div>
                        <div class="cell player F5"><span class="invisible-dot">•</span></div>
                        <div class="cell player F6"><span class="invisible-dot">•</span></div>
                        <div class="cell player F7"><span class="invisible-dot">•</span></div>
                        <div class="cell player F8"><span class="invisible-dot">•</span></div>
                        <div class="cell player F9"><span class="invisible-dot">•</span></div>
                        <div class="cell player F10"><span class="invisible-dot">•</span></div>
                        <div class="cell player G1"><span class="invisible-dot">•</span></div>
                        <div class="cell player G2"><span class="invisible-dot">•</span></div>
                        <div class="cell player G3"><span class="invisible-dot">•</span></div>
                        <div class="cell player G4"><span class="invisible-dot">•</span></div>
                        <div class="cell player G5"><span class="invisible-dot">•</span></div>
                        <div class="cell player G6"><span class="invisible-dot">•</span></div>
                        <div class="cell player G7"><span class="invisible-dot">•</span></div>
                        <div class="cell player G8"><span class="invisible-dot">•</span></div>
                        <div class="cell player G9"><span class="invisible-dot">•</span></div>
                        <div class="cell player G10"><span class="invisible-dot">•</span></div>
                        <div class="cell player H1"><span class="invisible-dot">•</span></div>
                        <div class="cell player H2"><span class="invisible-dot">•</span></div>
                        <div class="cell player H3"><span class="invisible-dot">•</span></div>
                        <div class="cell player H4"><span class="invisible-dot">•</span></div>
                        <div class="cell player H5"><span class="invisible-dot">•</span></div>
                        <div class="cell player H6"><span class="invisible-dot">•</span></div>
                        <div class="cell player H7"><span class="invisible-dot">•</span></div>
                        <div class="cell player H8"><span class="invisible-dot">•</span></div>
                        <div class="cell player H9"><span class="invisible-dot">•</span></div>
                        <div class="cell player H10"><span class="invisible-dot">•</span></div>
                        <div class="cell player I1"><span class="invisible-dot">•</span></div>
                        <div class="cell player I2"><span class="invisible-dot">•</span></div>
                        <div class="cell player I3"><span class="invisible-dot">•</span></div>
                        <div class="cell player I4"><span class="invisible-dot">•</span></div>
                        <div class="cell player I5"><span class="invisible-dot">•</span></div>
                        <div class="cell player I6"><span class="invisible-dot">•</span></div>
                        <div class="cell player I7"><span class="invisible-dot">•</span></div>
                        <div class="cell player I8"><span class="invisible-dot">•</span></div>
                        <div class="cell player I9"><span class="invisible-dot">•</span></div>
                        <div class="cell player I10"><span class="invisible-dot">•</span></div>
                        <div class="cell player J1"><span class="invisible-dot">•</span></div>
                        <div class="cell player J2"><span class="invisible-dot">•</span></div>
                        <div class="cell player J3"><span class="invisible-dot">•</span></div>
                        <div class="cell player J4"><span class="invisible-dot">•</span></div>
                        <div class="cell player J5"><span class="invisible-dot">•</span></div>
                        <div class="cell player J6"><span class="invisible-dot">•</span></div>
                        <div class="cell player J7"><span class="invisible-dot">•</span></div>
                        <div class="cell player J8"><span class="invisible-dot">•</span></div>
                        <div class="cell player J9"><span class="invisible-dot">•</span></div>
                        <div class="cell player J10"><span class="invisible-dot">•</span></div>
                    </div>
                </div>
                <div class="board-and-label-container">
                    <h2 class="board-label">ENEMY FLEET</h2>
                    <div class="game-computer-board">
                        <div class="cell computer A1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer A10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer B10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer C10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer D10"><span class="invisible-dot">•</span></div>  
                        <div class="cell computer E1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer E10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer F10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer G10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer H10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer I10"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J1"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J2"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J3"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J4"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J5"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J6"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J7"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J8"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J9"><span class="invisible-dot">•</span></div>
                        <div class="cell computer J10"><span class="invisible-dot">•</span></div>
                    </div>
                </div>
            </div>
                `;
export default html;