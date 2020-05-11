import { optionTemplate, subwayLinesItemTemplate } from "../../utils/templates.js";
import tns from "../../slider/tiny-slider.js";
import { EVENT_TYPE } from "../../utils/constants.js";
import Modal from "../../ui/Modal.js";
import api from '../../api/index.js';

function AdminEdge() {
  const $subwayLinesSlider = document.querySelector(".subway-lines-slider");
  const $createButton = document.querySelector("#submit-button");
  const $stationListContainer = document.querySelector(".line-station-list-container");
  const createSubwayEdgeModal = new Modal();

  const initSubwayLinesSlider = async () => {
    const subwayLines = await api.line.get();
    $subwayLinesSlider.innerHTML = subwayLines
      .map(line => subwayLinesItemTemplate(line))
      .join("");
    tns({
      container: ".subway-lines-slider",
      loop: true,
      slideBy: "page",
      speed: 400,
      autoplayButtonOutput: false,
      mouseDrag: true,
      lazyload: true,
      controlsContainer: "#slider-controls",
      items: 1,
      edgePadding: 25
    });
  };

  const initSubwayLineOptions = async () => {
    const subwayLines = await api.line.get();
    const subwayLineOptionTemplate = subwayLines
      .map(line => optionTemplate(line))
      .join("");
    const $stationSelectOptions = document.querySelector(
      "#station-select-options"
    );
    $stationSelectOptions.insertAdjacentHTML(
      "afterbegin",
      subwayLineOptionTemplate
    );
  };

  const onRemoveStationHandler = event => {
    const $target = event.target;
    const isDeleteButton = $target.classList.contains("mdi-delete");
    if (isDeleteButton) {
      const $listItem = $target.closest(".list-item");
      const lineId = $listItem.closest(".line-info-container").dataset.lineId;
      api.line.deleteLineStation(lineId, $listItem.dataset.stationId).then(async (response) => {
        if (response.ok) {
          $listItem.remove();
        } else {
          const res = await response.json();
          alert(res.message);
        }
      })
    }
  };

  async function onCreateEdgeHandler(event) {
    event.preventDefault();
    const $departStation = document.querySelector('#depart-station-name');
    const $arrivalStation = document.querySelector('#arrival-station-name');
    const stations = await api.station.get();
    const depart = stations.filter(value => value.name === $departStation.value)[0];
    const arrival = stations.filter(value => value.name === $arrivalStation.value)[0];

    if (!arrival) {
      alert("존재하지 않는 지하철 역입니다! 등록후 이용하세요. 😊");
    }

    const createRequest = {
      preStationId: depart ? depart.id : null,
      stationId: arrival.id,
      distance: 3,
      duration: 3
    };

    const $stationSelect = document.querySelector("#station-select-options");

    const lineId = $stationSelect.options[$stationSelect.selectedIndex].dataset.lineId;

    api.line.createLineStation(lineId, createRequest).then(async (response) => {
      if (response.ok) {
        createSubwayEdgeModal.toggle();
        window.location.href = window.location.href;
      } else {
        const res = await response.json();
        alert(res.message);
      }
    });
  }

  const initEventListeners = () => {
    $subwayLinesSlider.addEventListener(
      EVENT_TYPE.CLICK,
      onRemoveStationHandler
    );
    $createButton.addEventListener(
      EVENT_TYPE.CLICK,
      onCreateEdgeHandler
    )
    $stationListContainer.addEventListener(
      EVENT_TYPE.CLICK,
      onRemoveStationHandler
    );
  };

  this.init = () => {
    initSubwayLinesSlider();
    initSubwayLineOptions();
    initEventListeners();
  };
}

const adminEdge = new AdminEdge();
adminEdge.init();
