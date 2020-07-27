import { create } from './create';
import { Carousel } from './carousel';
// class MyComponent {
//     constructor() {
//         // console.log(config);
//         this.children = [];
//         this.attributes = new Map();
//     }

//     setAttribute(name, value) {
//         // console.log(name, value);
//         this.attributes.set(name, value);
//     }

//     appendChild(child) {
//         // console.log('child=>', child);
//         this.children.push(child);
//     }

//     render() {
//         return (
//             <div>
//                 <div>header</div>
//                 {this.slot}
//                 <div>footer</div>
//             </div>
//         );
//     }
//     mountTo(parent) {
//         this.slot = <div></div>;
//         for (let child of this.children) {
//             this.slot.appendChild(child);
//         }
//         this.render().mountTo(parent);
//     }
// }

// let component = (
//     <MyComponent title="title" props="property">
//         <div>11</div>
//         <p>22</p>
//         <div>33</div>
//     </MyComponent>
// );

let data = [
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
];
let component = <Carousel images={data}></Carousel>;

component.mountTo(document.getElementById('root'));

// console.log(component);
