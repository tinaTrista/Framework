/*
AngularJs 为 scope 模型上设置了一个 监听队列，用来监听数据变化并更新 view 。
每次绑定一个东西到 view(html) 上时 AngularJs 就会往 $watch 队列里插入一条 $watch，
用来检测它监视的 model 里是否有变化的东西。当浏览器接收到可以被 angular context 处理的事件时，$digest 循环就会触发。
$digest 会遍历所有的 $watch。从而更新DOM。

$watch
这有点类似于我们的观察者模式，在当前作用域$scope下，我们创建一个监控器$watchers和一个监听器$watch，
$watchers 负责管理所有的 $watch，当我们每次绑定到UI上的时候就自动创建一个$watch，并把它放到 $watchers。
*/

//controller.js
app.controller('MainCtrl', function($scope) {
  $scope.Hello = "Hello";
  $scope.world = "World";
});

//index.html
//<div>{{Hello}}</div>
//这里，即便我们在$scope上添加了两个变量，但是只有一个绑定在了UI上，因此在这里只生成了一个$watch

/*
$digest
当浏览器接收到可以被angular context处理的事件时，$digest循环就会触发。
$digest将会遍历我们的$watch，
如果$watch没有变化，这个循环检测就将停止，如果有至少一个更新过，这个循环就会再次触发，
直到所有的$watch都没有变化。这样就能够保证每个model都已经不会再变化。
这就是脏检查(Dirty Checking)机制
*/


//controller.js
app.controller('MainCtrl', function() {
  $scope.name = "Foo";

  $scope.changeFoo = function() {
      $scope.name = "Bar";
  }
});

//<div>{{ name }}</div>
//<button ng-click="changeFoo()">Change the name</button>

/*当我们按下按钮
浏览器接收到一个事件，进入angular context。
$digest循环开始执行，查询每个$watch是否变化。
由于监视$scope.name的$watch报告了变化，它会强制再执行一次$digest循环。
新的$digest循环没有检测到变化。
更新与$scope.name新值相应部分的DOM。
*/

/*
$apply
$apply 我们可以直接理解为刷新UI。如果当事件触发时，你调用$apply，它会进入angular context，
如果没有调用就不会进入，之后的$digest检测机制就不会触发
*/
app.directive('clickable', function() {
    return {
      restrict: "E",
      scope: {
        foo: '='
      },
      template: '<ul style="background-color: lightblue"><li>{{foo}}</li></ul>',
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          scope.foo++;
          console.log(scope.foo);
        });
      }
    }
});
/*当我们调用clickable指令的时候，我们可以看到foo的值增加了，
但是界面上显示的内容并没有改变。$digest脏检测机制没有触发，
检测foo的$watch就没有执行。
*/

//$apply()方法的两种形式
//1) 无参
//当我们使用这种形式的时候，如果在scope.$apply之前程序发生异常，那scope.$apply没有执行，界面就不会更新
$scope.$apply();
element.bind('click', function() {
  scope.foo++;
  //if error
  scope.$apply();
});

//2) 有参 如果用这种形式，即使后面的发生异常，数据还是会更新。
$scope.$apply(function(){
    ...
})
element.bind('click', function() {
  scope.$apply(function() {
      scope.foo++;
  });
})


// 在 AngularJS 中使用 $watch
// 常用的使用方式：

$scope.name = 'Hello';
$scope.$watch('name', function(newValue, oldValue) {
    if (newValue === oldValue) { return; }
    $scope.updated++;
});
// 传入到$watch()中的第二个参数是一个回调函数，该函数在name的值发生变化的时候会被调用。
//
// 如果要监听的是一个对象，那还需要第三个参数：

$scope.data.name = 'Hello';
$scope.$watch('data', function(newValue, oldValue) {
    if (newValue === oldValue) { return; }
    $scope.updated++;
}, true);
// 表示比较的是对象的值而不是引用，如果不加第三个参数true，在 data.name 变化时，不会触发相应操作，因为引用的是同一引用。
//
// 总结
// 1) 只有在$scope变量绑定到页面上，才会创建 $watch
// 2) $apply决定事件是否可以进入angular context
// 3) $digest 循环检查model时最少两次，最多10次(多于10次抛出异常，防止无限检查)
// 4) AngularJs自带的指令已经实现了$apply，所以不需要我们额外的编写
// 5) 在自定义指令时，建议使用带function参数的$apply
