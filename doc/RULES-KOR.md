# 일기예보 평가 방법
## 시작하기에 앞서
일기예보는 굉장히 복잡한 분야입니다. 오직 일기예보만을 위해 수많은 전문가, 어려운 수학적 모델 그리고 값비싼 슈퍼 컴퓨터를 쓰는 데는 다 이유가 있는 것입니다. 그러나 저는 기후나 예보 체계에 대해 제대로 배운 적이 없으며 전공자는 더더욱 아닙니다. 따라서 이 프로젝트에서 제공하는 **예보 점수**는 아주 자의적인 기준에 따라 만들었으며, 그에 따라 어떠한 공신력도 없음을 밝힙니다.

## 평가 방법론
이 프로젝트는 한반도 지역에 대한 각 국가별 기상청의 일기예보가 얼마나 정확한지를 비교하고자 합니다. 그러기 위해서는 우선 각 국가가 제공하는 일기예보를 점수화할 필요가 있습니다. 그러나 일기예보는 매우 복잡하기 때문에 하나의 단일 점수 산정에 있어 다음과 같은 몇 가지 어려움이 있습니다. 

* 일기예보는 다양한 *요소*를 예측합니다. 날씨, 기온, 풍속, 강수, 습도 등 굉장히 많은 요인이 있습니다. 때로는 태풍과 같은 특별한 기상현상도 있습니다.
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

## 조합의 구성
### 요소
한반도 지역에 대해 각 국가 기상청의 예보를 실제 날씨와 비교하여 각 국가의 예보 신뢰도를 점수화해