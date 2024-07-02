# Forecast Scoring Function
This document describes the deriving process of the forecast scoring function in [Forecast Score Calculation Method](./system-explained.md).

Based on *Assumption 1*, that the forecast score is a linear function of the difference between the forecasted value and the true value, the forecast score function $S$ has the following form where $a$, $b$ are constants.

$$ \begin{equation}
S (X, \hat{X}) = a - b (X - \hat{X})^2
\end{equation} $$

We can set the constants $a$, $b$ so that the above forecast score function can satisfy *Assumption 3*. The mathematical statement of *Assumption 3* is as follows:

$$ \begin{equation}
\begin{cases}
    S (X, \hat{X}) = 100
    \\
    \mathbb{E}[S (X, \mu)] = 0
\end{cases}
\end{equation}$$

Expanding the first equation of (2):

$$ \begin{equation}
100 = S (X, \hat{X}) = a - b (X - X)^2 = a
\end{equation} $$

Thus,

$$ \begin{equation}
a = 100
\end{equation} $$

Expanding the second equation of (2):

$$ \begin{equation}
    \begin{aligned}
        0 = \mathbb{E}[S (X, \mu)]
        & = a - b \mathbb{E}[(X - \mu)^2]
        \\ & = a - b \sigma^2 \mathbb{E} \left[
            \left(
                \frac{X - \mu}{\sigma}
            \right)^2
        \right]
        \\ & = a - b \sigma^2 \mathbb{E}[Z^2]
    \end{aligned}
\end{equation} $$

Note that $Z$ is the standard normal distribution, which has a following property:

$$ \begin{equation}
    Z \sim N(0, 1)
    \rightarrow 
    \mathbb{E}[Z^2] = \operatorname{Var}[Z] = 1
\end{equation} $$

By applying the property above to equation (5):

$$ \begin{equation}
    \begin{aligned}
        0 & = a - b \sigma^2 \mathbb{E}[Z^2]
        \\ & = a - b \sigma^2
    \end{aligned}
\end{equation} $$

Thus,

$$ \begin{equation}
    b = -100 \frac{1}{\sigma^2}
\end{equation} $$

By assigning $a$ and $b$ into the equation (1):

$$ \begin{equation}
S(X, \hat{X}) =
100 \left(
    1 - \left(
        \frac{X - \hat{X}}{\sigma}
    \right) ^2
\right)
\end{equation} $$
