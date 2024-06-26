# 일기예보 평가 방법
## 시작하기에 앞서
일기예보는 굉장히 복잡한 분야입니다. 오직 일기예보만을 위해 수많은 전문가, 어려운 수학적 모델 그리고 값비싼 슈퍼 컴퓨터를 쓰는 데는 다 이유가 있는 것입니다. 그러나 저는 기후나 예보 체계에 대해 제대로 배운 적이 없으며 전공자는 더더욱 아닙니다. 따라서 이 프로젝트에서 제공하는 **예보 점수**는 아주 자의적인 기준에 따라 만들었으며, 그에 따라 어떠한 공신력도 없음을 밝힙니다.

## 평가 방법론
이 프로젝트는 한반도 지역에 대한 각 국가별 기상청의 일기예보가 얼마나 정확한지를 비교하고자 합니다. 그러기 위해서는 우선 각 국가가 제공하는 일기예보를 점수화할 필요가 있습니다. 그러나 일기예보는 매우 복잡하기 때문에 하나의 단일 점수 산정에 있어 다음과 같은 몇 가지 어려움이 있습니다. 

* 일기예보는 다양한 *항목*을 예측합니다. 날씨, 기온, 풍속, 강수, 습도 등 굉장히 많은 요인이 있습니다. 때로는 태풍과 같은 특별한 기상현상도 있습니다.
* 일기예보는 여러 *지역*을 예측합니다. 서울시가 폭염주의보인 동안 제주도는 호우경보일 수 있습니다.
* 일기예보는 *시점*에 따라 계속 바뀝니다. 7일 전에 나온 일기예보는 1일 전에 다시 확인하면 바뀌어 있는 경우도 있습니다.

따라서 이 프로젝트에서는 다음과 같은 방법으로 **예보 점수**를 산정합니다.

1. 이 프로젝트는 설정되어 있는 모든 `예보항목`, `예보지역`, `예보시점`에 대해, 자동으로 모든 가능한 **조합**을 생성합니다.
    * 예를 들어 `(기온, 강원도, D-1)`이라는 **조합**을 생각해 볼 수 있습니다.
2. 모든 **조합**에 대해서 100점 만점의 **부분 예보 점수**를 산정합니다.
    * 점수산정법은 `예보항목`마다 산정 방법이 다릅니다. 예를 들어, 날씨의 점수산정법과 습도의 점수산정법은 다릅니다.
    * 예시의 경우, 1일 전에 발표한 강원도의 기온 예보가 채점 대상입니다. 채점 기준은 기온 점수산정법이며 오늘의 강원도 기온을 정답으로 두고 점수를 산정합니다.
3. 모든 **부분 예보 점수**를 가중평균하여 **예보 점수**를 산정합니다.
    * 이떄 가중치는 **조합**을 이루는 `예보항목`, `예보지역`, `예보시점`의 가중치를 모두 곱해 계산합니다.
    * 예시의 경우, 해당 부분점수는 `(기온 가중치) * (강원도 가중치) * (D-1 가중치)`만큼의 가중치를 가집니다.

각 점수산정법과 가중치에 대해서는 아래에서 기술합니다.

## 예보점수 산정법

예보점수 산정기준을 정하는 데는 적절한 통계적 기법이 필요합니다. 본격적으로 산정기준을 정의하기에 앞서, 이 프로젝트에서는 우리가 사용할 예보점수 체계가 다음과 같은 조건을 가져야 한다고 가정하겠습니다.

1. **예보점수**는 **예보값**(예보가 예측한 값)과 **참값**(실제 값)의 차이에 대한 일차함수 형태이다.
2. 예보점수 산정에 사용하는 참값의 분포는 정규분포를 따른다.
3. 예보점수는 100점을 최고점으로 한다.
    1. 참값과 예보값이 같을 때 100점으로 둔다.
    2. 단순히 참값의 평균값만을 예보값으로 제공하면, 그때 예보점수의 기댓값을 0점으로 둔다.

3-2번 조건은 더 자세히 설명하겠습니다. 예를 들어, 8월에 대한민국은 장마철이기 때문에 비가 많이 옵니다. 따라서 단순히 비가 온다고만 예보해도 그 적중률이 꽤 높을 것입니다. 수치모델링과 컴퓨터 시뮬레이션을 토대로 세밀한 예측을 하는 대신 단순하게 작년 비슷한 날짜의 강수량 평균값으로만 예보하는 일은 누구라도 할 수 있습니다. 따라서 이런 행위는 0점으로 두고 하한선으로 설정한 것입니다. 물론 평균 예보보다 못한 예보는 0점보다 낮은 점수를 받을 수도 있습니다.

위와 같은 가정을 토대로 수학적으로 분석하면, 예보항목 $e$에 대해 참값이 $X_e$, 예보값이 $\hat{X}_e$라고 할 때 예보점수함수 $S_e(X_e, \hat{X}_e)$는 다음과 같은 형태를 가지게 됩니다. 단, 참값 $X_e$는 정규분포 $N(\mu_e, \sigma_e^2)$를 따릅니다.

$$
S_e(X_e, \hat{X}_e)
=
100(
    1 - \frac{
        \sqrt{\pi}
    }{
        \sqrt{2} \sigma_e
    } 
    |X_e - \hat{X}_e|
)
$$

위 수식의 유도에 대해서는 [예보점수 함수 증명(영어)](./forecast-scoring.md)을 참조하세요.

## 가중치 구성

### 예보항목

#### 날씨

#### 기온

#### 풍속

#### 강수

#### 습도

### 예보지역

| 예보지역 | 가중치 | 기준도시 |
|----------|-----|--------|
| 경기도 | 50% | 서울 |
| 강원도 | 5% | 춘천 |
| 충청도 | 10% | 대전 |
| 전라도 | 10% | 광주 |
| 경상도 | 25% | 부산 |

### 예보시점

| 예보시점 | 가중치 |
|----------|-----|
| 12시간 전 | 30% |
| 24시간 전 | 25% |
| 36시간 전 | 20% |
| 48시간 전 | 15% |
| 60시간 전 | 10% |
| 72시간 전 | 10% |

## 평가 대상 기상청