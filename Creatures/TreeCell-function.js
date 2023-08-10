let trees = [];
function createTreeCell() {

  const treeCount = 3; // 假设您想要5棵树
    const spacing = width / treeCount; // 计算画布宽度与树数量之间的间距

    for (let i = 0; i < treeCount; i++) {
        let x = spacing * i + spacing / 2; // 计算每棵树的x坐标
        let y = height  

        // let totalLevels = floor(random(3, 5));
        // let branchCount = floor(random(2, 4));
        let totalLevels = 3;
        let branchCount = 2;
        //看好在哪个physics里面
        let tree = new Tree(x, y, random(70, 120), branchCount, physics, totalLevels);
        //let tree = new Tree(x, y, random(50, 100), branchCount, tailPhysics, totalLevels);
        trees.push(tree);
    }
}

function drawTreeCell() {

    for (let tree of trees) {
        tree.show();
    }

} 