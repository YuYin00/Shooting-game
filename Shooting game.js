let wrapper = document.querySelector('.wrapper'),
    //按键
    startBtn = document.querySelector('.start'),
    stopBtn = document.querySelector('.stop'),
    continueBtn = document.querySelector('.continue'),
    againBtn = document.querySelector('.again'),
    // 飞机
    plane = document.querySelector('.plane'),
    touchPlane,
    mousePlane,
    // 子弹
    bullets = document.querySelectorAll('.bullet'),
    findBullets,
    shootBullets,
    // 怪兽和道具
    monsters = document.querySelectorAll('.monster'),
    monsterInit,
    monsterMove,
    explode = document.querySelector('.explode'),
    cane = document.querySelector('.cane'),
    // 分数
    score = 0,
    scoreAll = document.querySelector('.scoreAll'),
    // 规则
    rule = document.querySelector('.rule'),
    ruleDetails = document.querySelector('.ruleDetails');

//规则和规则详情
rule.addEventListener('click', event => {
    event.stopPropagation();
    ruleDetails.style.display = 'block';
})

wrapper.addEventListener('click', () => {
    ruleDetails.style.display = 'none';
})

// 开始游戏
startBtn.addEventListener('click', () => {
    startShoot();
    startMonsters();
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    plane.style.display = 'block';
    document.querySelector('.score').style.display = 'block';
    rule.style.display = 'none';
});

//暂停游戏
stopBtn.addEventListener('click', () => {
    continueBtn.style.display = 'block';
    stop();
});

let stop = function() {
    stopBtn.style.display = 'none';
    stopShoot();
    stopMonsters();
    plane.removeEventListener('touchstart', touchPlane);
    plane.removeEventListener('mousedown', mousePlane);
}

//继续游戏
continueBtn.addEventListener('click', () => {
    stopBtn.style.display = 'block';
    startShoot();
    continMonsters()
    continueBtn.style.display = 'none';
    plane.addEventListener('touchstart', touchPlane);
    plane.addEventListener('mousedown', mousePlane);
})

//重新开始
againBtn.addEventListener('click', () => {
    window.location.reload();
})

//总分数板
function scoreboard() {
    document.querySelector('.score').innerText = `得分：${+score}`;
}

//计算击中分数
function countShoot(monster) {
    if (monster.getAttribute('data-hit') !== 'true') {
        monster.setAttribute('data-hit', 'true');
        if (monster.classList.contains('monster1')) {
            score += 10;
        } else if (monster.classList.contains('monster2')) {
            score += 1;
        } else if (monster.classList.contains('monster3')) {
            score += 5;
        } else if (monster.classList.contains('cane')) {
            score -= 20;
        } else if (monster.classList.contains('explode')) {
            score -= 15;
        }
    }
    return score;
}

//计算道具分数
function countProp(prop) {
    if (monster.getAttribute('data-hit') !== 'true') {
        prop.setAttribute('data-hit', 'true');
        if (prop.classList.contains('cane')) {
            score += 40;
        } else if (prop.classList.contains('explode')) {
            score += 30;
        }
    }
    return score;
}

// 找子弹
function findBullet() {
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].offsetTop < 0) {
            bullets[i].style.top = plane.offsetTop + 15 + 'px';
            bullets[i].style.left = plane.offsetLeft + 25 + 'px';
        }
    }
}

//发射子弹
function shootBullet() {
    for (let j = 0; j < bullets.length; j++) {
        if (bullets[j].offsetTop > -30) {
            bullets[j].style.top = bullets[j].offsetTop - 30 + 'px';
        }
    }
    //击败
    for (monster of monsters) {
        for (bullet of bullets) {
            //击落单个怪兽
            if (judgeIntersect(bullet, monster)) {
                monster.innerText = '💥';
                monster.style.background = 'transparent';
                monster.style.fontSize = '55px';
                hideMonster(monster);
                bullet.style.top = '-100px';
                //计算分数
                countShoot(monster);
                scoreboard();

                break;
            }
            //吃到爆照变身器的
            if (judgeIntersect(plane, explode)) {
                if (monster.offsetTop < wrapper.offsetHeight && monster.offsetTop > 0) {
                    for (monster of monsters) {
                        bombMonster(monster);
                        hideMonster(monster);
                        bullet.style.top = '-100px';
                        //计算分数
                        countShoot(monster);
                        scoreboard();
                    }
                    //计算分数
                    countProp(explode);
                    scoreboard();
                }
            }
            break;
        }
        //吃到魔法棒变子弹
        if (judgeIntersect(plane, cane)) {
            for (bullet of bullets) {
                bullet.innerText = '🌟';
            }
            bombMonster(cane);
            hideMonster(cane);
            setTimeout(() => {
                for (bullet of bullets) {
                    bullet.innerText = '🌙';
                }
            }, 3000);
            //计算分数
            countProp(cane);
            scoreboard();

            break;
        }
        //飞机被击落
        if (judgeIntersect(monster, plane)) {
            bombMonster(monster);
            hideMonster(monster);
            bullet.style.top = '-100px';
            //飞机变化
            plane.classList.add('afertPlane');
            againBtn.style.display = 'block';
            stop();
            //分数板
            scoreAll.style.display = 'block';
            scoreAll.innerText = `总得分:${+score}`;
            document.querySelector('.score').style.display = 'none';
        }
    }
}

//怪兽爆炸
function bombMonster(monster) {
    monster.innerText = '💥';
    monster.style.background = 'transparent';
    monster.style.fontSize = '55px';
}

//怪兽消失
function hideMonster(monster) {
    setTimeout(() => {
        monster.style.fontSize = '0px';
        monster.innerText = '';
        monster.style.top = '-1000px';
        monster.style.background = null;
        const maxLeft = wrapper.offsetWidth - monster.offsetWidth;
        monster.style.left = _.random(0, maxLeft) + 'px'
        monster.removeAttribute('data-hit');
    }, 300);
}

//开始射击
function startShoot() {
    findBullets = setInterval(findBullet, 30);
    shootBullets = setInterval(shootBullet, 10);
}

//停止射击
function stopShoot() {
    clearInterval(findBullets);
    clearInterval(shootBullets);
}

//移动飞机(移动端)
plane.addEventListener('touchstart', touchPlane = function(event) {
    const touch = event.touches[0];
    const shiftX = touch.clientX - plane.offsetLeft;
    const shiftY = touch.clientY - plane.offsetTop;

    plane.addEventListener('touchmove', event => {
        const touch = event.touches[0];

        //判断上边和左边不能超过最小值
        let top = touch.pageY - shiftY;
        top = top > 0 ? top : 0;

        let left = touch.pageX - shiftX;
        left = left > 0 ? left : 0;

        //设置飞机拖拽的位置横向纵向最大的宽度 不超过 背景图
        let maxLeft = document.querySelector('.wrapper').offsetWidth - plane.offsetWidth;
        let maxTop = document.querySelector('.wrapper').offsetHeight - plane.offsetHeight;

        // //判断飞机拖拽的左边和上边距离不超过 最大宽度，否则使用left原值
        left = left > maxLeft ? maxLeft : left;
        top = top > maxTop ? maxTop : top;

        // 四边赋值
        plane.style.left = left + 'px';
        plane.style.top = top + 'px';
    });
});

//移动飞机(PC端)
plane.addEventListener('mousedown', mousePlane = function(event) {
    let shiftX = event.clientX - plane.offsetLeft;
    let shiftY = event.clientY - plane.offsetTop;

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleStop)

    function handleMove(event) {

        let top = event.pageY - shiftY;
        top = top > 0 ? top : 0;

        let left = event.pageX - shiftX;
        left = left > 0 ? left : 0;

        let maxLeft = document.querySelector('.wrapper').offsetWidth - plane.offsetWidth;
        let maxTop = document.querySelector('.wrapper').offsetHeight - plane.offsetHeight;

        left = left > maxLeft ? maxLeft : left;
        top = top > maxTop ? maxTop : top;

        plane.style.left = left + 'px';
        plane.style.top = top + 'px';
    }

    function handleStop() {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleStop);
    }
});

//取消浏览器自带的拖拽事件
plane.ondragstart = () => false;

//设置怪兽初始位置和步长
function resetMonsters() {
    for (let monster of monsters) {
        const maxLeft = wrapper.offsetWidth - monster.offsetWidth;
        const maxTop = monster.offsetHeight;
        monster.setAttribute('data-setp', _.random(3, 7));
        monster.style.left = _.random(0, maxLeft) + 'px';
        monster.style.top = _.random(-1000, maxTop) + 'px';
    }
}

// 怪兽走起来
function moveMonsters() {
    for (let monster of monsters) {
        if (monster.offsetTop < wrapper.offsetHeight) {
            const setp = +monster.getAttribute('data-setp');
            monster.style.top = monster.offsetTop + setp + 'px';
        }
    }
}

// 怪兽就位
function initMonster() {
    for (let monster of monsters) {
        if (monster.offsetTop >= wrapper.offsetHeight) {
            const maxLeft = wrapper.offsetWidth - monster.offsetWidth;
            //第三个参数表示是否需要返回小数，默认为 false。
            monster.setAttribute('data-setp', _.random(3, 7));
            monster.style.left = _.random(0, maxLeft) + 'px';
            monster.style.top = -monster.offsetHeight + 'px';
            break;
        }
    }
}

// 怪兽进攻
function startMonsters() {
    resetMonsters();
    monsterInit = setInterval(initMonster, 100);
    monsterMove = setInterval(moveMonsters, _.random(10, 30));
}

//暂停怪兽
function stopMonsters() {
    clearInterval(monsterInit);
    clearInterval(monsterMove);
}

//继续怪兽
function continMonsters() {
    monsterInit = setInterval(initMonster, _.random(100, 400));
    monsterMove = setInterval(moveMonsters, _.random(10, 40));
}

//判断子弹和怪兽是否相交
function judgeIntersect(bullet, monster) {
    let noIntersect =
        (monster.getBoundingClientRect().right < bullet.getBoundingClientRect().left) ||
        (monster.getBoundingClientRect().left > bullet.getBoundingClientRect().right) ||
        (monster.getBoundingClientRect().bottom < bullet.getBoundingClientRect().top) ||
        (monster.getBoundingClientRect().top > bullet.getBoundingClientRect().bottom);
    //相交
    let intersect = !noIntersect;
    return intersect;
}