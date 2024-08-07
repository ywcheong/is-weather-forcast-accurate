# 일기예보 평가 방법
## 시작하기에 앞서
일기예보는 굉장히 복잡한 분야입니다. 오직 일기예보만을 위해 수많은 전문가, 어려운 수학적 모델 그리고 값비싼 슈퍼 컴퓨터를 쓰는 데는 다 이유가 있는 것입니다. 그러나 저는 기후나 예보 체계에 대해 제대로 배운 적이 없으며 전공자는 더더욱 아닙니다. 따라서 이 프로젝트에서 제공하는 **예보점수**는 간단한 통계적 이론에 기초했을 뿐, 전문적인 점수 비교 지표로는 부적절하다는 것을 밝힙니다. 또한 이 프로젝트에서 점수를 평가하는 일기예보 서비스의 목록을 확인하고 싶다면, [weather-source.md](./weather-source.md)를 확인하세요.

## 평가 방법론
이 프로젝트는 한반도 지역에 대한 각 국가별 기상청의 일기예보가 얼마나 정확한지를 비교하고자 합니다. 그러기 위해서는 우선 각 국가가 제공하는 일기예보를 점수화할 필요가 있습니다. 그러나 일기예보는 매우 복잡하기 때문에 하나의 단일 점수 채점에 있어 다음과 같은 몇 가지 어려움이 있습니다. 

* 일기예보에는 다양한 `예보지표`가 있습니다.
    * 기상청은 기온, 풍속, 강수, 습도 등 여러 지표를 발표합니다.
    * 예를 들어, 풍속은 정확했지만 강수량을 틀렸다면 우리가 느끼는 체감 오류는 더 클 것입니다.
* 일기예보에는 다양한 `예보지역`이 있습니다.
    * 한반도는 좁지만, 지역마다 날씨가 다릅니다.
    * 예를 들어, 서울시가 폭염주의보인 동안 제주도는 호우경보일 수 있습니다.
* 일기예보에는 다양한 `예보시점`이 있습니다.
    * 예보시점에 따라 일기예보가 달라질 수 있습니다.
    * 예를 들어, 3일 전에 나온 일기예보는 1일 전에 다시 확인하면 바뀌어 있는 경우도 있습니다.

따라서 이 프로젝트에서는 다음과 같은 방법으로 **예보점수**를 채점합니다.

1. `예보지표`, `예보지역`, `예보시점`에서 나올 수 있는 모든 경우의 수를 고려합니다.
    * 예를 들어 `(기온, 강원도, D-1)`과 같은 경우를 생각해 볼 수 있습니다.
2. 모든 **조합**에 대해서 100점 만점의 **부분 예보점수**를 채점합니다.
    * 예보점수 채점법은 아래에 설명되어 있습니다.
3. 모든 **부분 예보점수**를 가중평균하여 **예보점수**를 채점합니다.
    * 이떄 가중치는 **조합**을 이루는 `예보지표`, `예보지역`, `예보시점`의 가중치를 모두 곱해 계산합니다.
    * 예시의 경우, 해당 부분점수는 `(기온 가중치) * (강원도 가중치) * (D-1 가중치)`만큼의 가중치를 가집니다.

각 점수채점법과 가중치에 대해서는 아래에서 기술합니다.

## 예보점수 채점법

### 용어 정의
본격적으로 채점기준을 정의하기에 앞서, 이 프로젝트에서 중요하게 사용하는 몇 가지 용어를 우선 정의하겠습니다.

| 용어 | 기호 | 설명 |
|------|-----|------|
| 참값 | $X$ | 날씨를 숫자로 나타낸 값입니다. |
| 예보값 | $\hat{X}$ | 일기예보에서 예측한 참값입니다. 참값과 가까울수록 정확한 예보입니다. |
| 예보점수 | $S$ | 참값과 예보값을 바탕으로 채점한 값입니다. 최대 100점입니다. |

### 예보점수 채점기준
예보점수 채점기준을 정하는 데는 적절한 통계적 기법이 필요합니다. 이 프로젝트에서는 우리가 사용할 예보점수 채점기준이 다음과 같은 조건을 가져야 한다고 가정하겠습니다.

1. 예보점수 채점에 사용하는 참값의 분포는 정규분포를 따른다.
2. 예보점수는 100점 만점으로 한다.
    1. 예보점수는 만점에서 시작해, 예보값과 참값의 오차의 제곱에 비례해 감점한다.
    2. 단순히 참값의 평균값만을 예보값으로 제공하면, 그때 예보점수의 기댓값을 0점으로 둔다.

2-2번 조건에 대한 보충 설명을 위해 한 가지 예를 들겠습니다. 8월에 대한민국은 장마철이기 때문에 비가 많이 옵니다. 따라서 단순히 비가 온다고만 예보해도 그 적중률이 꽤 높을 것입니다. 수치모델링과 컴퓨터 시뮬레이션을 토대로 세밀한 예측을 하는 대신 단순하게 작년 비슷한 날짜의 강수량 평균값으로만 예보하는 일은 누구라도 할 수 있습니다. 따라서 이런 행위는 0점으로 두고 하한선으로 설정한 것입니다. 물론 평균 예보보다 못한 예보는 0점보다 낮은 점수를 받을 수도 있습니다.

참값이 정규분포 $X \sim N (\mu, \sigma^2)$를 따른다고 할 때, 위와 같은 가정을 토대로 수학적으로 분석하면 예보점수함수는 다음과 같은 형태를 가지게 됩니다.

$$ S(X, \hat{X}) =
100 \left(
    1 - \left(
        \frac{X - \hat{X}}{\sigma}
    \right) ^2
\right) $$

위 수식의 유도에 대해서는 [예보점수 함수 증명(영어)](./forecast-scoring.md)을 참조하세요.

1번 조건에 대한 보충 설명을 덧붙이자면, 실제로 참값은 정규분포를 따르지 않습니다. 편의를 위해 모든 참값이 하나의 정규분포를 따르는 것처럼 표현했지만 날씨는 일반적으로는 정규분포를 따르지 않습니다. 예를 들어, 한반도 기온의 경우 여름과 겨울에 데이터가 쏠린 형태로 나타납니다. 이는 정규분포와는 반대되는 모습입니다. 이러한 부분의 오차를 보정하고자 이 프로젝트에서는 일 년이 아닌, 한 달 안에서 데이터의 분포가 정규분포를 따른다고 가정합니다.

이를 위해 실제 이 프로젝트의 구현에서는 예보지표을 월별 구간으로 분할하여 각각 다른 예보점수함수를 사용합니다. 이 프로젝트에서 구현된 예보점수함수는 **최근 3년의 같은 달 내에서 1시간 단위로 수집된 예보지표의 표준편차**를 $\sigma$로 사용함을 참조하기 바랍니다.

또한 예보지표 중 날씨의 경우 위의 채점기준이 아닌, 다른 채점기준을 사용합니다. 날씨는 다음 표와 같은 기준으로 점수를 부여합니다.

| 참값 | 점수 |
|-----|------|
| | |

## 가중치 구성표 & 산정기준

예보지표 4개, 예보지역 5개, 예보시점 24개를 사용해 총 480개의 경우의 수가 있습니다.

### 예보지표 (4개)

예보지표의 가중치 산정기준은 어떠한 수학적 근거도 없으며 그냥 적당한 숫자를 골랐습니다.

| 예보지표 | 가중치 |
|----------|-----|
| 날씨 | 25% |
| 강수량 | 25% |
| 기온 | 25% |
| 풍속 | 15% |
| 습도 | 10% |

### 예보지역 (5개)

예보지역의 가중치 산정기준은 2023년 통계청 지역별 인구수 비례로 산정했으며, 다음과 같습니다.

| 예보지역 | 가중치 | 기준도시 |
|----------|-----|--------|
| 경기도 | 50% | 서울 |
| 강원도 | 5% | 춘천 |
| 충청도 | 10% | 대전 |
| 전라도 | 10% | 광주 |
| 경상도 | 25% | 부산 |

### 예보시점 (24개)

예보시점은 참값의 시점을 기준으로 3시간 단위로 총 24개의 이전 시점을 사용하며, 가중치는 다음과 같습니다.

| 예보시점 | 가중치 |
|----------|-----|
| 3시간 전 | $\frac{24}{300}\%$ |
| 6시간 전 | $\frac{23}{300}\%$ |
| ⋮ | ⋮ |
| $3k$시간 전 | $\frac{25-k}{300}\%$ |
| ⋮ | ⋮ |
| 72시간 전 | $\frac{1}{300}\%$ |

모두 합하면 $100\%$입니다.

## Weather Forecast Service Evaluated
