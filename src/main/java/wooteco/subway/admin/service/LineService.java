package wooteco.subway.admin.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;

import wooteco.subway.admin.domain.Line;
import wooteco.subway.admin.dto.LineResponse;
import wooteco.subway.admin.dto.LineStationCreateRequest;
import wooteco.subway.admin.repository.LineRepository;
import wooteco.subway.admin.repository.StationRepository;

@Service
public class LineService {
    private LineRepository lineRepository;
    private StationRepository stationRepository;

    public LineService(LineRepository lineRepository, StationRepository stationRepository) {
        this.lineRepository = lineRepository;
        this.stationRepository = stationRepository;
    }

    public Line save(Line line) {
        if (lineRepository.findLineWithStationsByName(line.getName()).isPresent()) {
            throw new IllegalArgumentException("중복된 지하철 역입니다. name = " + line.getName());
        }
        return lineRepository.save(line);
    }

    public List<Line> showLines() {
        return lineRepository.findAll();
    }

    public void updateLine(Long id, Line line) {
        Line persistLine = lineRepository.findById(id).orElseThrow(RuntimeException::new);
        if (lineRepository.findLineWithStationsByName(line.getName()).isPresent()) {
            throw new IllegalArgumentException("중복된 지하철 역입니다. name = " + line.getName());
        }
        persistLine.update(line);
        lineRepository.save(persistLine);
    }

    public void deleteLineById(Long id) {
        lineRepository.deleteById(id);
    }

    public void addLineStation(Long id, LineStationCreateRequest request) {
        // TODO: 구현
    }

    public void removeLineStation(Long lineId, Long stationId) {
        // TODO: 구현
    }

    public LineResponse findLineWithStationsById(Long id) {
        Line line = lineRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("존재 하지 않는 Line 입니다. id=" + id));

        return LineResponse.of(line);
    }
}
