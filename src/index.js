import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";
import { Template } from "webpack";

let map;

async function init() {
       const neighborhoods = await import("../data/output.json");
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
      map.setStyle(style);


    map.getSource("neighborhoods").setData(neighborhoods);

    initPopup();
}



const popup = document.querySelector("#popup") ;
let hovered;

function initPopup() {
    const neighborhood = popup.querySelector(".neighborhood");
    const count = popup.querySelector(".count");

    map.on("mousemove", "neighborhoods-fill", function(e){
        clearHover();
        if (e.features.length > 0){
            hovered = e.features[0];
            map.setFeatureState(hovered,{
                hover: true

            });
            popup.style.display = "block";
            neighborhood.textContent = hovered.properties.name;
            count.textContent = hovered.properties.count;
        }    
    });
    map.on ("mouseleave", "neighborhoods-fill", clearHover)
}

function clearHover(){
    if (hovered){
        map.setFeatureState(hovered,{
            hover: false
        });
    }
    popup.style.display = "none";
    hovered = undefined;
}

function initLegend(){
    const legend = document.querySelector("#legend");
    const Template =document.querySelector("legend-entry");
    const fillColorStyle = map.getPaintProperty("neighborhoods-fill", "fill-extrusion-color");

    fillColorStyle.splice(0,2);
    let total = 0;

    for (let index = 0; index < fillColorStyle.length; index+=2) {
        const entry = document.importNode(template.content, true);
        const span = entry.querySelectorAll ("span");
        const color = fillColorStyle[index] ;
        const count = fillColorStyle[index+1] ;

        spans[0].style.backgroundColor = color;

        if(index === fillColorStyle.length -1){

        } else{
            spans[1].textContent = total ="-"(count -1);
            total =count;

        }
        
        legend.appendChild(entry);
    }

}


mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);