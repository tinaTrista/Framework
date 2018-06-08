/*
以观察者模式，来思考angularJS的双向绑定
 */

/*
观察者模式
我理解的是一对多的关系，只有一个被观察者，多个观察者；
被观察者一旦发生变化，就会通知观察者。
*/

/**
 * Angular编译过程 （ps watchers [] 被观察者数组
 * 解析html模版， 遇到ng-model ,ng-bind，{{}}指令，生成一个被观察者对象 watcher, 并将其放入watchers数组中
 */
// 被观察者对象数组
let watchers = [];
// 被观察者对象
let  watcher = {
  newValue: '',
  oldValue: '',
  watchersList: [], // 绑定该对象的dom元素
  callback: function(){
    // 对dom元素上绑定的值进行重新赋值
  }
}
watchers.push(watcher)


/**
 * 浏览器 UI事件等其他触发数据变化的事情发生
 * 以click事件为例子
 */
 <button ng-click="increase">{{watcher}}</button>
 let increase = function() {
   $scope.watcher++
 }
// 此时数据更新了，即被观察者的值变化了，但是Angular不知道
// 事件发生了，不表明数据变化了


/*
Vue 这种基于setter的框架，它可以再给数据赋值的时候，对dom元素上绑定的值进行重新赋值。
但是 Angular 并不是基于setter的框架，它并没有任何途径在数据发生了变更后立即得到通知，
因此需要一种机制，把数据的变更应用到界面上，这就是$digest 脏检查。
 */

/*
$digest脏检查的过程：
（1）$digest循环开始后，它会触发每个watcher。这些 watcher会检查scope中的当前model值是否和上一次计算得到的model值不同。
    如果不同，那么对应的回调函数会被执行
（2）如果有至少一个更新过，这个循环就会再次触发，直到所有的 watcher都没有变化
 (3) 如果watcher没有变化，这个循环检测就将停止
 */

/*
为什么呢？$digest循环会运行多少次？
当一个$digest循环运行时，watchers会被执行来检查scope中的models是否发生了变化。
如果发生了变化，那么相应的listener函数就会被执行。
这涉及到一个重要的问题。如果listener函数本身会修改一个scope model呢？Angular会怎么处理这种情况？
 */



/**
 * $digest循环不会只运行一次。
 * 在当前的一次循环结束后，它会再执行一次循环用来检查是否有models发生了变化。
 * 因此，$digest循环会持续运行直到model不再发生变化，
 *
 * 或者$digest循环的次数达到了10次。因此，尽可能地不要在listener函数中修改model。
 *
 * $digest循环最少也会运行两次，即使在listener函数中并没有改变任何model。
 * 正如上面讨论的那样，它会多运行一次来确保models没有变化。
 */
